import '../styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { esMX } from '@clerk/localizations';

const inter = Inter({ subsets: ['latin'] });


export const metadata: Metadata = {
  title: 'Otechpro Dashboard',
  description: 'Sitio para gestionar proyectos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={esMX}>
      <html lang="es">
        <body className={`bg-white ${inter.className}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}