import WigwamProvider from '@/app/(wigwam)/components/Provider/WigmawProvider';
import WigwamHeader from '@/app/(wigwam)/components/header/WigwamHeader';
import WigwamFooter from '@/app/(wigwam)/components/footer/WigwamFooter';
import CookiesPanel from 'components/Cookies/CookiesPanel';
import '../../../globals.scss';

const Layout = async ({
  children,
  params: { childId },
}: {
  children: React.ReactNode;
  params: {
    childId: string;
  };
}) => (
  <WigwamProvider>
    <WigwamHeader childId={childId} />
    <main>{children}</main>
    <WigwamFooter childId={childId} />
    <CookiesPanel />
  </WigwamProvider>
);

export default Layout;
