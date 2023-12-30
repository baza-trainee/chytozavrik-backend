import { getServerSession } from 'next-auth';
import { authOptions } from '@/config';
import AdditionalInfo from '@/components/AdditionalInfo';
import Donate from '@/components/Donate';
import About from '@/components/About/About';
import AboutDetail from '@/components/AboutDetail/AboutDetail';
import Partners from 'src/app/(main)/components/Partners';
import Auth from '@/components/Auth';
import Advantages from '@/app/(main)/components/Advantages/Advantages';
import Refresh from 'components/Refresh/Refresh';
import Hero from '@/app/(main)/components/Hero/Hero';

const Home = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session ? (
        <>
          <Hero />
          <About />
          <Advantages />
          <Donate />
          <Partners />
          <AdditionalInfo />
        </>
      ) : (
        <>
          <Hero />
          <About />
          <AboutDetail />
          <Donate />
          <Advantages />
          <Partners />
          <AdditionalInfo />
        </>
      )}

      <Auth />
      <Refresh />
    </>
  );
};

export default Home;
