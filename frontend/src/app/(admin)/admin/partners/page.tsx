import React from 'react';
import { Metadata } from 'next';
import PartnersList from './components/PartnersList/PartnersList';

export const metadata: Metadata = {
  title: 'Партнери - Читозаврик',
};

const Partners = () => <PartnersList />;

export default Partners;
