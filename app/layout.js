import { Unbounded, Manrope } from 'next/font/google';
import './globals.css';

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-unbounded',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-manrope',
});

export const metadata = {
  title: 'Boletas [Nombre]',
  description: 'Compra tu boleta escaneando el QR',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${unbounded.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-bg font-body text-text-primary">
        {children}
      </body>
    </html>
  );
}
