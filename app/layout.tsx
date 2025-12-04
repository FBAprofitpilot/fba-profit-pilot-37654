import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FBA Profit Pilot – Amazon FBA Gebührenrechner 2025',
  description: 'Exakter Gewinnrechner für deutsche Amazon FBA-Seller',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
