import WigwamProvider from '@/app/(wigwam)/components/Provider/WigmawProvider';
import WigwamHeader from '@/app/(wigwam)/components/header/WigwamHeader';
import WigwamFooter from '@/app/(wigwam)/components/footer/WigwamFooter';
import CookiesPanel from 'components/Cookies/CookiesPanel';
import { fetch } from '@/services/axios';
import { notFound } from 'next/navigation';
import { Avatar, ChildResults } from '@/types/ChildrenResults';
import '../../../globals.scss';

const Layout = async ({
  children,
  params: { childId },
}: {
  children: React.ReactNode;
  params: {
    childId: string;
  };
}) => {
  const childReq = await fetch<ChildResults>(`/users/me/children/${childId}/`);

  if (childReq.status === 'fail') notFound();

  return (
    <WigwamProvider>
      <WigwamHeader
        childId={childId}
        name={childReq.data.name}
        avatar={childReq.data.avatar_as_url}
      />
      <main>{children}</main>
      <WigwamFooter childId={childId} />
      <CookiesPanel />
    </WigwamProvider>
  );
};

export default Layout;
