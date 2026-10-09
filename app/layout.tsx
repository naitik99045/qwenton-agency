import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'qwenton-agents — Tactile AI Coworker Platform',
  description: 'Deploy, operate, and control specialized AI agents with built-in safety, human approvals, and multi-channel intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-canvas text-ink antialiased selection:bg-cloud-blue selection:text-primary-deep">
        {children}
      </body>
    </html>
  );
}
