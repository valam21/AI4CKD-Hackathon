// frontend/src/components/navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../context/auth-context'; // Assurez-vous que le chemin est correct

export default function Navbar() { // Exportez-le comme default
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="container mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        AI4CKD
      </Link>
      <ul className="flex space-x-4">
        <li>
          <Link href="/patients" className="hover:underline">
            Patients
          </Link>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <span className="text-white mx-2.5">{user?.email}</span>
            </li>
            <li>
              <button onClick={logout} className="hover:underline">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login" className="hover:underline">
                Connexion
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:underline">
                Inscription
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}