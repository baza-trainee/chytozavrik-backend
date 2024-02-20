import { Montserrat_Alternates as Montserrat, Raleway } from 'next/font/google';
import Providers from '@/app/providers';
import { Metadata } from 'next';

const raleway = Raleway({
  variable: '--raleway-font',
  weight: ['300', '400', '500', '800'],
  style: 'normal',
  subsets: ['cyrillic'],
  display: 'swap',
});

const montserratAlternates = Montserrat({
  variable: '--montserrat-alternates-font',
  weight: ['300', '400', '600'],
  style: 'normal',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon/apple-touch-icon.png',
    },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="uk" className={`${raleway.variable} ${montserratAlternates.variable}`}>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
