import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Udyam Registration Portal - Demo',
  description: 'A production-grade replica of the Udyam Registration portal for demonstration purposes',
  keywords: 'udyam, registration, msme, government, india, demo',
  authors: [{ name: 'Demo Portal' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px'
            }
          }}
        />
      </body>
    </html>
  );
}