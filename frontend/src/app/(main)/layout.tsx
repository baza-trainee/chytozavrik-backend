import { Metadata } from 'next';

import '../globals.scss';
import Header from '@/app/(main)/components/Header/Header';
import Footer from 'components/Footer/Footer';
import CookiesPanel from 'components/Cookies/CookiesPanel';

export const metadata: Metadata = {
  title: 'Читозаврик - Інтерактивна Вікторина Для Маленьких Читолюбів - ',
  description:
    'Додаток розроблений спеціально для дітей віком від 6 до 9 років. Захоплюючі книжкові вікторини дозволяють не тільки закріпити знання про прочитане, а ще й розвивати розумові навички.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
    <CookiesPanel />
  </>
);

export default RootLayout;
