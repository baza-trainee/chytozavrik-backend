import React from 'react';
import { Metadata } from 'next';
import AddPartner from './components/AddPartner';

export const metadata: Metadata = {
  title: 'Додати партнера - Читозаврик',
};

const AddPage = () => <AddPartner />;

export default AddPage;
