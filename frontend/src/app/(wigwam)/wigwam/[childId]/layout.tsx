import WigwamProvider from '@/app/(wigwam)/components/Provider/WigmawProvider';
import WigwamHeader from '@/app/(wigwam)/components/header/WigwamHeader';
import WigwamFooter from '@/app/(wigwam)/components/footer/WigwamFooter';
import CookiesPanel from 'components/Cookies/CookiesPanel';
import { fetch } from '@/services/axios';
import { notFound } from 'next/navigation';
import { Avatar, ChildResults } from '@/types/ChildrenResults';
import '../../../globals.scss';
import { QueryClient } from '@tanstack/react-query';
import { getChildById, getMonstersService } from '@/services/api';

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
