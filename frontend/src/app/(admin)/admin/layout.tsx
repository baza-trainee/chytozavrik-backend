import { SideBar } from '@/app/(admin)/components';
import styles from './Admin.module.scss';
import '../../globals.scss';

const Layout = ({
  children,
  params: { childId },
}: {
  children: React.ReactNode;
  params: {
    childId: string;
  };
}) => (
  <main className={styles.container}>
    <SideBar />
    <section className={styles.section}>{children}</section>
  </main>
);

export default Layout;
