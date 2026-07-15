import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Analytics from './components/Analytics';
import LiquidBackground from './components/LiquidBackground';
import { SITE_URL, DEFAULT_OG_IMAGE } from './lib/seo';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rajesh K',
    template: '%s',
  },
  description: 'Personal blog of Rajesh K',
  openGraph: {
    title: 'Rajesh K',
    description: 'Personal blog of Rajesh K',
    url: `${SITE_URL}/`,
    siteName: 'Rajesh K',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rajesh K',
    description: 'Personal blog of Rajesh K',
    images: [DEFAULT_OG_IMAGE],
  },
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
        <LiquidBackground />
        {children}
      </body>
    </html>
  );
}
