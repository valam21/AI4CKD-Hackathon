// src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/auth-context'; // Assurez-vous du chemin correct
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function RegisterPage() { // Renommé de LoginPage à RegisterPage
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); // Pour se connecter automatiquement après l'inscription
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, { // Changé l'endpoint à /api/auth/register
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Erreur HTTP: ${res.status}`);
      }

      const data = await res.json();
      // Connexion automatique après l'inscription
      login(data.token, data.user);
      // La redirection vers la page des patients est déjà gérée par login()
    } catch (err: unknown) { // Changé 'any' en 'unknown' pour une meilleure sécurité de type
      let errorMessage = "Une erreur inconnue est survenue.";
      if (err instanceof Error) {
        errorMessage = `Erreur lors de l'inscription: ${err.message}`; // Message d'erreur mis à jour
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        // Fallback pour les objets non-Error qui pourraient avoir une propriété message
        errorMessage = `Erreur lors de l'inscription: ${String((err as { message: unknown }).message)}`; // Message d'erreur mis à jour
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Inscription</h1> {/* Titre mis à jour */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Mot de passe:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Inscription en cours...' : 'S\'inscrire'} {/* Texte du bouton mis à jour */}
            </button>
          </div>
          <p className="mt-4 text-center text-gray-600">
            Déjà un compte ?{' '} {/* Texte du lien mis à jour */}
            <Link href="/login" className="text-blue-600 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
