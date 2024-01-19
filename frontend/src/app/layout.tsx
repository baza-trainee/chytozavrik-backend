import { Montserrat_Alternates as Montserrat, Raleway } from 'next/font/google';
import Providers from '@/app/providers';

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

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="uk" className={`${raleway.variable} ${montserratAlternates.variable}`}>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;
