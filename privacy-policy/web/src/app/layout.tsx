import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const title = 'FullHex — Privacy Policy';
const description =
  'Privacy policy for FullHex, a browser extension that removes blank ad-space gutters on colonist.io. FullHex collects, stores, and transmits no user data.';
const url = 'https://fullhex.jussaw.com';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title,
    description,
    url,
    siteName: 'FullHex',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
