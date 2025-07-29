// src/app/patients/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/auth-context'; // Importez useAuth
import { useRouter } from 'next/navigation'; // Importez useRouter

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string;
  antecedents_medicaux?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function PatientsPage() {
  const { isAuthenticated, isLoading, token } = useAuth(); // Récupérez l'état d'auth
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true); // Renommé pour éviter la confusion
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return; // Attendre que l'état d'auth soit chargé

    if (!isAuthenticated) {
      router.push('/login'); // Redirige si non authentifié
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/patients`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Incluez le token
          },
        });
        if (!res.ok) {
          // Gérer les erreurs spécifiques d'authentification ou de serveur
          if (res.status === 401 || res.status === 403) {
             // Si le token est invalide ou expiré, déconnecter l'utilisateur
             router.push('/login?message=session_expired');
             return;
          }
          throw new Error(`Erreur HTTP: ${res.status}`);
        }
        const data: Patient[] = await res.json();
        setPatients(data);
      } catch (err: unknown) { // Changé 'any' en 'unknown'
        let errorMessage = "Une erreur inconnue est survenue.";
        if (err instanceof Error) {
          errorMessage = `Impossible de charger les patients: ${err.message}`;
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
          errorMessage = `Impossible de charger les patients: ${String((err as { message: unknown }).message)}`;
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPatients();
  }, [isAuthenticated, isLoading, router, token]); // Dépendances pour useEffect

  if (isLoading || !isAuthenticated) {
    // Affiche un état de chargement ou rien en attendant la redirection
    return <p className="text-center text-gray-600">Chargement de l&apos;authentification...</p>;
  }

  if (loadingData) return <p className="text-center text-gray-600">Chargement des patients...</p>;
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
