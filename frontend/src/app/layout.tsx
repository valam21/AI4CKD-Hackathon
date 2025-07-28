import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI4CKD - Gestion Patients',
  description: 'Application de gestion des patients atteints de MRC avec alertes intelligentes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="bg-blue-600 text-white p-4 shadow-md">
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
              {/* Ajoutez d'autres liens de navigation ici si nécessaire */}
            </ul>
          </nav>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}