import { Toaster } from 'react-hot-toast';
import { UserProvider } from '@/hooks/useUser';
import './globals.css';

export const metadata = {
  title: 'PrepTrack | Your Exam Command Center',
  description: 'The AI-powered study OS for UPSC, JEE & NEET aspirants who are serious about cracking it.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <UserProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--green)',
                  secondary: 'var(--bg-card)',
                },
              },
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}
