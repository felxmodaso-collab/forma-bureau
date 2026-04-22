import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono, Caveat } from 'next/font/google';
import { InkFilters } from '@/components/InkFilters';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400'],
  variable: '--font-inter',
  display: 'swap'
});

const mono = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap'
});

// Used only as a base for handwritten SVG annotations (rendered as SVG text
// with a feTurbulence filter — still handrwritten visually, not a raw font).
const caveat = Caveat({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-caveat',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Форма — частное архитектурное бюро, два проекта в год',
  description:
    'Частные дома 350–800 м². Москва. Один архитектор, двух проектов в год.',
  openGraph: {
    title: 'Форма — архитектурное бюро',
    description: 'Частные дома. Два проекта в год.',
    type: 'website'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${fraunces.variable} ${inter.variable} ${mono.variable} ${caveat.variable}`}
    >
      <body>
        <InkFilters />
        <div className="paper-grain" aria-hidden="true" />
        <div className="paper-vignette" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
