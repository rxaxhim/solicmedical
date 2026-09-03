import type { Metadata } from 'next';
import { Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Semi-geometric display face for headings, nav and buttons — squared-off
// curves give it a precision-instrument feel that suits medical equipment.
const display = Manrope({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Body face — highly readable at small sizes, with more character than Inter.
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Solic Medical Equipment | Medical & Surgical Supplies Canada',
  description:
    'Solic Medical Equipment is a trusted Canadian supplier of medical and surgical equipment for clinics, hospitals, and physician offices. Toronto-based since 2011.',
  metadataBase: new URL('https://solicmedical.com'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans" suppressHydrationWarning>{children}</body>
    </html>
  );
}
