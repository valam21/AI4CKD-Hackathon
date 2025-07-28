import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Bienvenue sur AI4CKD - Gestion des Patients MRC
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Optimisez la prise en charge des patients atteints de maladie rénale chronique grâce aux alertes intelligentes et aux synthèses de dossiers.
      </p>
      <Link
        href="/patients"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
      >
        Voir la liste des patients
      </Link>
    </div>
  );
}