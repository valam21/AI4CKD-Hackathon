export interface Alert {
  id?: number;
  patient_id: number;
  consultation_id: number;
  type_alerte: string;     // Ex: "CreatinineAnormale", "TensionElevee", "PertePoidsRapide"
  message_alerte: string;  // Description détaillée de l'alerte
  date_declenchement: Date; // Date et heure du déclenchement
  statut: 'active' | 'resolved'; // Pour suivre si l'alerte a été traitée
}