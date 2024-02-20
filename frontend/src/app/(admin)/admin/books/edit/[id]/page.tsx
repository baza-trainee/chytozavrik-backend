import React from 'react';
import { Metadata } from 'next';
import EditBook from '@/app/(admin)/admin/books/edit/[id]/components/EditBook';

export const metadata: Metadata = {
  title: 'Редагувати книгу - Читозаврик',
};

interface EditBooksPageProps {
  params: { id: number };
}
const EditBooksPage = ({ params: { id } }: EditBooksPageProps) => <EditBook id={id} />;

export default EditBooksPage;
