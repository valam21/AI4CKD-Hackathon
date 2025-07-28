import { Request, Response } from 'express';
import db from '../config/db';
import { Patient } from '../models/Patient';
import { Consultation } from '../models/Consultation';
import { Alert } from '../models/Alert';
import { evaluateConsultationForAlerts } from '../services/alertService'; // Importer le service d'alertes
import { QueryResult } from 'pg';
import { generatePatientPdf } from '../services/pdfGeneratorService'; // Importez le service de génération PDF

// Créer un nouveau patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { nom, prenom, date_naissance, antecedents_medicaux } = req.body;
    const query = `
      INSERT INTO patients (nom, prenom, date_naissance, antecedents_medicaux)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nom, prenom, date_naissance, antecedents_medicaux];
    const result: QueryResult<Patient> = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du patient:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du patient.' });
  }
};

// Obtenir tous les patients
export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const result: QueryResult<Patient> = await db.query('SELECT * FROM patients ORDER BY nom, prenom;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des patients:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des patients.' });
  }
};

// Obtenir un patient par ID avec ses consultations et alertes
export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Récupérer les informations du patient
    const patientResult: QueryResult<Patient> = await db.query(
      'SELECT * FROM patients WHERE id = $1;',
      [id]
    );
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }
    const patient = patientResult.rows[0];

    // Récupérer les consultations du patient
    const consultationsResult: QueryResult<Consultation> = await db.query(
      'SELECT * FROM consultations WHERE patient_id = $1 ORDER BY date_consultation DESC;',
      [id]
    );
    const consultations = consultationsResult.rows;

    // Récupérer les alertes du patient
    const alertsResult: QueryResult<Alert> = await db.query(
      'SELECT * FROM alerts WHERE patient_id = $1 ORDER BY date_declenchement DESC;',
      [id]
    );
    const alerts = alertsResult.rows;

    res.status(200).json({ patient, consultations, alerts });
  } catch (error) {
    console.error('Erreur lors de la récupération du patient par ID:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du patient.' });
  }
};

// Enregistrer une nouvelle consultation pour un patient
// Cette fonction inclura la logique de déclenchement d'alerte. [cite: 15]
export const addConsultation = async (req: Request, res: Response) => {
  try {
    const patientId = parseInt(req.params.id);
    const {
      creatinine,
      tension_arterielle_systolique,
      tension_arterielle_diastolique,
      poids,
      notes_cliniques,
      date_consultation // Permettre de spécifier la date ou utiliser CURRENT_TIMESTAMP par défaut
    } = req.body;

    const query = `
      INSERT INTO consultations (patient_id, date_consultation, creatinine, tension_arterielle_systolique, tension_arterielle_diastolique, poids, notes_cliniques)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      patientId,
      date_consultation || new Date(), // Utilise la date fournie ou la date actuelle
      creatinine,
      tension_arterielle_systolique,
      tension_arterielle_diastolique,
      poids,
      notes_cliniques,
    ];

    const result: QueryResult<Consultation> = await db.query(query, values);
    const newConsultation = result.rows[0];

    // Déclencher le système d'alerte après l'enregistrement de la consultation [cite: 15]
    const triggeredAlerts = await evaluateConsultationForAlerts(newConsultation);

    res.status(201).json({
      consultation: newConsultation,
      alerts_triggered: triggeredAlerts,
      message: 'Consultation enregistrée avec succès et alertes évaluées.',
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la consultation:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de la consultation.' });
  }
};

// Fonction pour exporter le dossier patient en PDF
export const exportPatientPdf = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Récupérer les informations du patient
    const patientResult: QueryResult<Patient> = await db.query(
      'SELECT * FROM patients WHERE id = $1;',
      [id]
    );
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ message: 'Patient non trouvé.' });
    }
    const patient = patientResult.rows[0];

    // Récupérer les consultations du patient
    const consultationsResult: QueryResult<Consultation> = await db.query(
      'SELECT * FROM consultations WHERE patient_id = $1 ORDER BY date_consultation DESC;',
      [id]
    );
    const consultations = consultationsResult.rows;

    // Récupérer les alertes du patient (actives ou non, selon le besoin du PDF)
    const alertsResult: QueryResult<Alert> = await db.query(
      'SELECT * FROM alerts WHERE patient_id = $1 ORDER BY date_declenchement DESC;', // Vous pouvez filtrer par statut='active' si besoin
      [id]
    );
    const alerts = alertsResult.rows;

    // Générer le PDF
    const pdfBuffer = await generatePatientPdf(patient, consultations, alerts);

    // Définir les headers pour le téléchargement du fichier
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=dossier_patient_${patient.nom}_${patient.prenom}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF.' });
  }
};