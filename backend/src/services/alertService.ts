import { Consultation } from '../models/Consultation';
import { Alert } from '../models/Alert';
import db from '../config/db'; // Importez le pool de connexion
import { QueryResult } from 'pg';

/**
 * Définit les seuils par défaut pour les alertes.
 * Ces seuils pourraient être personnalisables par patient à l'avenir. [cite: 17]
 */
const ALERT_THRESHOLDS = {
  CREATININE_HIGH: 1.2, // Exemple: > 1.2 mg/dL
  SYSTOLIC_HIGH: 140,   // Exemple: > 140 mmHg
  DIASTOLIC_HIGH: 90,    // Exemple: > 90 mmHg
  // Pour la perte de poids rapide, cela nécessiterait de comparer avec la consultation précédente.
  // Pour cet exemple initial, nous nous concentrons sur les valeurs absolues.
};

/**
 * Évalue une nouvelle consultation et déclenche des alertes si nécessaire.
 * @param consultation La consultation à évaluer.
 * @returns Une promesse qui résout une liste des alertes déclenchées.
 */
export const evaluateConsultationForAlerts = async (
  consultation: Consultation
): Promise<Alert[]> => {
  const triggeredAlerts: Alert[] = [];

  // Règle d'alerte: Créatinine anormale 
  if (consultation.creatinine > ALERT_THRESHOLDS.CREATININE_HIGH) {
    triggeredAlerts.push({
      patient_id: consultation.patient_id,
      consultation_id: consultation.id!,
      type_alerte: 'CreatinineElevée',
      message_alerte: `Attention: Le taux de créatinine (${consultation.creatinine} mg/dL) est élevé et dépasse le seuil de ${ALERT_THRESHOLDS.CREATININE_HIGH} mg/dL.`,
      date_declenchement: new Date(),
      statut: 'active',
    });
  }

  // Règle d'alerte: Tension artérielle élevée 
  if (
    consultation.tension_arterielle_systolique > ALERT_THRESHOLDS.SYSTOLIC_HIGH ||
    consultation.tension_arterielle_diastolique > ALERT_THRESHOLDS.DIASTOLIC_HIGH
  ) {
    triggeredAlerts.push({
      patient_id: consultation.patient_id,
      consultation_id: consultation.id!,
      type_alerte: 'TensionArterielleElevee',
      message_alerte: `Attention: La tension artérielle (${consultation.tension_arterielle_systolique}/${consultation.tension_arterielle_diastolique} mmHg) est élevée.`,
      date_declenchement: new Date(),
      statut: 'active',
    });
  }

  // TODO: Implémenter la détection de "perte de poids rapide" 
  // Cela nécessiterait de récupérer la consultation précédente du patient pour comparer les poids.
  // Pour simplifier dans un premier temps, nous nous en tenons aux valeurs absolues.

  // Enregistrer les alertes déclenchées dans la base de données
  for (const alert of triggeredAlerts) {
    const query = `
      INSERT INTO alerts (patient_id, consultation_id, type_alerte, message_alerte, date_declenchement, statut)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      alert.patient_id,
      alert.consultation_id,
      alert.type_alerte,
      alert.message_alerte,
      alert.date_declenchement,
      alert.statut,
    ];
    try {
      await db.query(query, values);
      console.log(`Alerte "${alert.type_alerte}" déclenchée et enregistrée pour le patient ${alert.patient_id}.`);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'alerte:', error);
    }
  }

  return triggeredAlerts;
};