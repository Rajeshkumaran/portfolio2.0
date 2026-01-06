import type { Metadata } from 'next';
import { Geist, Poppins } from 'next/font/google';
import './globals.css';
import Analytics from './components/Analytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rajesh K',
  description: 'Personal blog of Rajesh K',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body
        className={`${geistSans.variable} ${poppins.variable} antialiased bg-customGray1`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
