import React from 'react';
import { Metadata } from 'next';
import AddBook from './component/AddBook';

export const metadata: Metadata = {
  title: 'Додати книгу - Читозаврик',
};

const AddPage = () => <AddBook />;

export default AddPage;
