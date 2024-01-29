import { Metadata } from 'next';

import WigwamPage from '@/app/(wigwam)/components/Wigwam/WigwamPage/WigwamPage';

export const metadata: Metadata = {
  title: 'Твій вігвам - Читозаврик',
};

interface WigwamProps {
  params: { childId: string };
}

const Wigwam = ({ params: { childId } }: WigwamProps) => <WigwamPage params={{ childId }} />;

export default Wigwam;
