export interface Patient {
  id?: number;
  nom: string;
  prenom: string;
  date_naissance: Date; // Ou string si vous préférez gérer la date comme une chaîne
  antecedents_medicaux?: string; // Champ optionnel pour les antécédents
  // Ajoutez d'autres champs pertinents si nécessaire (adresse, téléphone, etc.)
}