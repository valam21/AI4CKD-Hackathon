'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns'; // Pour formater les dates

// Définitions d'interfaces pour les données
interface Patient {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  antecedents_medicaux?: string;
}

interface Consultation {
  id: number;
  patient_id: number;
  date_consultation: string;
  creatinine: number;
  tension_arterielle_systolique: number;
  tension_arterielle_diastolique: number;
  poids: number;
  notes_cliniques?: string;
}

interface Alert {
  id: number;
  patient_id: number;
  consultation_id: number;
  type_alerte: string;
  message_alerte: string;
  date_declenchement: string;
  statut: 'active' | 'resolved';
}

interface PatientDetailData {
  patient: Patient;
  consultations: Consultation[];
  alerts: Alert[];
}

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState<PatientDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // États pour la nouvelle consultation
  const [newConsultation, setNewConsultation] = useState({
    creatinine: '',
    tension_arterielle_systolique: '',
    tension_arterielle_diastolique: '',
    poids: '',
    notes_cliniques: '',
    date_consultation: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'), // Format pour input datetime-local
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] = useState(false);
  const [consultationError, setConsultationError] = useState<string | null>(null);
  const [consultationSuccess, setConsultationSuccess] = useState<string | null>(null);


  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/patients/${patientId}`);
      if (!res.ok) {
        throw new Error(`Erreur HTTP: ${res.status}`);
      }
      const data: PatientDetailData = await res.json();
      setPatientData(data);
    } catch (err: any) {
      setError(`Impossible de charger les détails du patient: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingConsultation(true);
    setConsultationError(null);
    setConsultationSuccess(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/patients/${patientId}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatinine: parseFloat(newConsultation.creatinine),
          tension_arterielle_systolique: parseFloat(newConsultation.tension_arterielle_systolique),
          tension_arterielle_diastolique: parseFloat(newConsultation.tension_arterielle_diastolique),
          poids: parseFloat(newConsultation.poids),
          notes_cliniques: newConsultation.notes_cliniques,
          date_consultation: newConsultation.date_consultation ? new Date(newConsultation.date_consultation).toISOString() : new Date().toISOString()
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erreur HTTP: ${res.status}`);
      }

      setConsultationSuccess('Consultation ajoutée avec succès et alertes évaluées !');
      setNewConsultation({ // Réinitialise le formulaire
        creatinine: '',
        tension_arterielle_systolique: '',
        tension_arterielle_diastolique: '',
        poids: '',
        notes_cliniques: '',
        date_consultation: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      });
      fetchPatientDetails(); // Recharger les données pour afficher la nouvelle consultation et les alertes
    } catch (err: any) {
      setConsultationError(`Erreur lors de l'ajout de la consultation: ${err.message}`);
      console.error(err);
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  const handlePdfExport = async () => {
    if (!patientId || !patientData?.patient) {
      alert('Impossible de générer le PDF : informations patient manquantes.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/patients/${patientId}/pdf`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erreur HTTP: ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossier_patient_${patientData.patient.nom}_${patientData.patient.prenom}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Libérer l'URL de l'objet

      alert('Le PDF a été généré et téléchargé avec succès !');

    } catch (err: any) {
      console.error('Erreur lors de l\'exportation PDF:', err);
      alert(`Erreur lors de l\'exportation PDF : ${err.message}`);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement des détails du patient...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!patientData) return <p className="text-center text-gray-600">Patient non trouvé.</p>;

  const { patient, consultations, alerts } = patientData;

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dossier Patient: {patient.prenom} {patient.nom}</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Informations du Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Nom:</strong> {patient.nom}</p>
            <p><strong>Prénom:</strong> {patient.prenom}</p>
            <p><strong>Date de Naissance:</strong> {format(new Date(patient.date_naissance), 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <p><strong>Antécédents Médicaux:</strong> {patient.antecedents_medicaux || 'N/A'}</p>
            <button
              onClick={handlePdfExport}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Générer PDF du Dossier
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Alertes Actives</h2>
        {alerts.length === 0 ? (
          <p className="text-gray-600">Aucune alerte active pour ce patient.</p>
        ) : (
          <ul>
            {alerts.map((alert) => (
              <li key={alert.id} className="mb-2 p-3 border border-red-300 bg-red-50 rounded-md">
                <p className="font-semibold text-red-700">Type: {alert.type_alerte}</p>
                <p className="text-red-600">{alert.message_alerte}</p>
                <p className="text-sm text-gray-500">Déclenchée le: {format(new Date(alert.date_declenchement), 'dd/MM/yyyy HH:mm')}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Ajouter une Nouvelle Consultation</h2>
        {consultationError && <p className="text-red-500 mb-4">{consultationError}</p>}
        {consultationSuccess && <p className="text-green-500 mb-4">{consultationSuccess}</p>}
        <form onSubmit={handleConsultationSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="creatinine" className="block text-gray-700 text-sm font-bold mb-2">
                Créatinine (mg/dL):
              </label>
              <input
                type="number"
                step="0.01"
                id="creatinine"
                name="creatinine"
                value={newConsultation.creatinine}
                onChange={(e) => setNewConsultation({ ...newConsultation, creatinine: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="tensionSystolique" className="block text-gray-700 text-sm font-bold mb-2">
                Tension Systolique (mmHg):
              </label>
              <input
                type="number"
                step="0.1"
                id="tensionSystolique"
                name="tension_arterielle_systolique"
                value={newConsultation.tension_arterielle_systolique}
                onChange={(e) => setNewConsultation({ ...newConsultation, tension_arterielle_systolique: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="tensionDiastolique" className="block text-gray-700 text-sm font-bold mb-2">
                Tension Diastolique (mmHg):
              </label>
              <input
                type="number"
                step="0.1"
                id="tensionDiastolique"
                name="tension_arterielle_diastolique"
                value={newConsultation.tension_arterielle_diastolique}
                onChange={(e) => setNewConsultation({ ...newConsultation, tension_arterielle_diastolique: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="poids" className="block text-gray-700 text-sm font-bold mb-2">
                Poids (kg):
              </label>
              <input
                type="number"
                step="0.1"
                id="poids"
                name="poids"
                value={newConsultation.poids}
                onChange={(e) => setNewConsultation({ ...newConsultation, poids: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="dateConsultation" className="block text-gray-700 text-sm font-bold mb-2">
                Date et Heure de la consultation:
              </label>
              <input
                type="datetime-local"
                id="dateConsultation"
                name="date_consultation"
                value={newConsultation.date_consultation}
                onChange={(e) => setNewConsultation({ ...newConsultation, date_consultation: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="notesCliniques" className="block text-gray-700 text-sm font-bold mb-2">
                Notes Cliniques:
              </label>
              <textarea
                id="notesCliniques"
                name="notes_cliniques"
                value={newConsultation.notes_cliniques}
                onChange={(e) => setNewConsultation({ ...newConsultation, notes_cliniques: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmittingConsultation}
            >
              {isSubmittingConsultation ? 'Ajout en cours...' : 'Ajouter Consultation'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Historique des Consultations</h2>
        {consultations.length === 0 ? (
          <p className="text-gray-600">Aucune consultation enregistrée pour ce patient.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Créatinine
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tension Artérielle
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Poids
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {format(new Date(consultation.date_consultation), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {consultation.creatinine} mg/dL
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {consultation.tension_arterielle_systolique}/{consultation.tension_arterielle_diastolique} mmHg
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {consultation.poids} kg
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {consultation.notes_cliniques || 'Aucune'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}