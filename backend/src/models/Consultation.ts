export interface Consultation {
  id?: number;
  patient_id: number;
  date_consultation: Date; // Date de la consultation
  creatinine: number;      // Taux de créatinine
  tension_arterielle_systolique: number; // Tension systolique
  tension_arterielle_diastolique: number; // Tension diastolique
  poids: number;           // Poids du patient
  notes_cliniques?: string; // Notes du professionnel de santé
  // Ajoutez d'autres valeurs cliniques clés pertinentes [cite: 21]
}