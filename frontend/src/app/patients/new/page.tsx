// src/app/patients/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context'; // Importez useAuth

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function AddPatientPage() {
  const { isAuthenticated, isLoading, token } = useAuth(); // Récupérez l'état d'auth
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [antecedentsMedicaux, setAntecedentsMedicaux] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluez le token
        },
        body: JSON.stringify({
          nom,
          prenom,
          date_naissance: dateNaissance,
          antecedents_medicaux: antecedentsMedicaux,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erreur HTTP: ${res.status}`);
      }

      router.push('/patients');
    } catch (err: unknown) { // Changé 'any' en 'unknown'
      let errorMessage = "Une erreur inconnue est survenue.";
      if (err instanceof Error) {
        errorMessage = `Erreur lors de l&apos;ajout du patient: ${err.message}`; // Échappement de l'apostrophe et message mis à jour
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = `Erreur lors de l&apos;ajout du patient: ${String((err as { message: unknown }).message)}`; // Échappement de l'apostrophe et message mis à jour
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <p className="text-center text-gray-600">Chargement de l&apos;authentification...</p>; // Échappement de l'apostrophe
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Ajouter un nouveau Patient</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nom" className="block text-gray-700 text-sm font-bold mb-2">
              Nom:
            </label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="prenom" className="block text-gray-700 text-sm font-bold mb-2">
              Prénom:
            </label>
            <input
              type="text"
              id="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateNaissance" className="block text-gray-700 text-sm font-bold mb-2">
              Date de Naissance:
            </label>
            <input
              type="date"
              id="dateNaissance"
              value={dateNaissance}
              onChange={(e) => setDateNaissance(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="antecedentsMedicaux" className="block text-gray-700 text-sm font-bold mb-2">
              Antécédents Médicaux:
            </label>
            <textarea
              id="antecedentsMedicaux"
              value={antecedentsMedicaux}
              onChange={(e) => setAntecedentsMedicaux(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter Patient'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/patients')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
