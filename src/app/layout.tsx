import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Analytics from './components/Analytics';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
        {/* Preload gtag for faster analytics initialization */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
