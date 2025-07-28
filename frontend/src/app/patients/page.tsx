'use client'; // Ce composant est un Client Component car il utilise des hooks ou des événements côté client

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string; // ISO string
  antecedents_medicaux?: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/patients`); // Assurez-vous que le backend tourne sur le port 5000
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data: Patient[] = await res.json();
        setPatients(data);
      } catch (err: any) {
        setError(`Impossible de charger les patients: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Chargement des patients...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (patients.length === 0) return (
    <div className="text-center py-10">
      <p className="text-lg text-gray-600 mb-4">Aucun patient trouvé. Ajoutez-en un nouveau !</p>
      <Link href="/patients/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
        Ajouter un nouveau patient
      </Link>
    </div>
  );

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liste des Patients</h1>
      <div className="flex justify-end mb-4">
         <Link href="/patients/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
            Ajouter un nouveau patient
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date de Naissance
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{patient.nom}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{patient.prenom}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(patient.date_naissance).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-blue-600 hover:text-blue-900 font-semibold"
                  >
                    Voir Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}