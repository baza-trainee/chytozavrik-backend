import React from 'react';
import { Metadata } from 'next';
import EditPartner from './components/EditPartner';

export const metadata: Metadata = {
  title: 'Редагувати партнера - Читозаврик',
};

interface EditBooksPageProps {
  params: { id: number };
}
const EditBooksPage = ({ params: { id } }: EditBooksPageProps) => <EditPartner id={id} />;

export default EditBooksPage;
