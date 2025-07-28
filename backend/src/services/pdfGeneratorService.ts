import PDFDocument from 'pdfkit';
import { Patient } from '../models/Patient';
import { Consultation } from '../models/Consultation';
import { Alert } from '../models/Alert';
import { format } from 'date-fns'; // Assurez-vous d'avoir date-fns installé dans le backend aussi (pnpm add date-fns)

// Si date-fns n'est pas installé dans le backend, vous pouvez utiliser les fonctions Date() natives
// ou ajouter pnpm add date-fns et @types/date-fns dans le backend.

/**
 * Génère un PDF du dossier patient.
 * @param patient Les informations du patient.
 * @param consultations La liste des consultations du patient.
 * @param alerts La liste des alertes du patient.
 * @returns Un Buffer contenant le PDF généré.
 */
export const generatePatientPdf = async (
  patient: Patient,
  consultations: Consultation[],
  alerts: Alert[]
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // --- EN-TÊTE ---
    doc
      .fontSize(24)
      .text('Dossier Patient AI4CKD', { align: 'center' })
      .moveDown(1.5);

    // --- INFORMATIONS DU PATIENT ---
    doc.fontSize(16).text('Informations du Patient', { underline: true }).moveDown(0.5);
    doc.fontSize(12)
      .text(`Nom: ${patient.nom}`)
      .text(`Prénom: ${patient.prenom}`)
      .text(`Date de Naissance: ${format(new Date(patient.date_naissance), 'dd/MM/yyyy')}`)
      .text(`Antécédents Médicaux: ${patient.antecedents_medicaux || 'Aucun'}`)
      .moveDown(1.5);

    // --- ALERTES ACTIVES ---
    doc.fontSize(16).text('Alertes Actives', { underline: true }).moveDown(0.5);
    if (alerts.length === 0) {
      doc.fontSize(12).text('Aucune alerte active pour ce patient.').moveDown(1.5);
    } else {
      alerts.forEach((alert, index) => {
        doc.fontSize(12)
          .fillColor('red') // Texte rouge pour les alertes
          .text(`- Type: ${alert.type_alerte}`)
          .text(`  Message: ${alert.message_alerte}`)
          .text(`  Déclenchée le: ${format(new Date(alert.date_declenchement), 'dd/MM/yyyy HH:mm')}`)
          .moveDown(0.5)
          .fillColor('black'); // Revenir au noir pour le texte normal
      });
      doc.moveDown(1);
    }

    // --- HISTORIQUE DES CONSULTATIONS ---
    doc.fontSize(16).text('Historique des Consultations', { underline: true }).moveDown(0.5);
    if (consultations.length === 0) {
      doc.fontSize(12).text('Aucune consultation enregistrée pour ce patient.').moveDown(1.5);
    } else {
      // Entête du tableau
      const tableTop = doc.y;
      const dateX = 50;
      const creatinineX = 150;
      const tensionX = 250;
      const poidsX = 350;
      const notesX = 450;

      doc.font('Helvetica-Bold')
         .text('Date', dateX, tableTop)
         .text('Créatinine', creatinineX, tableTop)
         .text('Tension', tensionX, tableTop)
         .text('Poids', poidsX, tableTop)
         .text('Notes', notesX, tableTop);
      doc.font('Helvetica'); // Revenir à la police normale

      let currentY = tableTop + 20; // Espacement après l'en-tête

      consultations.forEach((consultation, index) => {
        // Vérifier si une nouvelle page est nécessaire
        if (currentY > doc.page.height - 100) { // Si proche du bas de page
            doc.addPage();
            currentY = 50; // Recommencer en haut de la nouvelle page
            doc.font('Helvetica-Bold') // Ré-imprimer l'en-tête du tableau sur la nouvelle page
               .text('Date', dateX, currentY)
               .text('Créatinine', creatinineX, currentY)
               .text('Tension', tensionX, currentY)
               .text('Poids', poidsX, currentY)
               .text('Notes', notesX, currentY);
            doc.font('Helvetica');
            currentY += 20;
        }

        doc.text(format(new Date(consultation.date_consultation), 'dd/MM/yy HH:mm'), dateX, currentY)
           .text(`${consultation.creatinine} mg/dL`, creatinineX, currentY)
           .text(`${consultation.tension_arterielle_systolique}/${consultation.tension_arterielle_diastolique} mmHg`, tensionX, currentY)
           .text(`${consultation.poids} kg`, poidsX, currentY)
           .text(consultation.notes_cliniques || 'N/A', notesX, currentY, { width: 100, align: 'left' }); // Limiter la largeur des notes

        currentY += 30; // Espacement entre les lignes
      });
    }

    doc.end();
  });
};