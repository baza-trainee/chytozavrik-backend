import React from 'react';
import { Metadata } from 'next';
import RecommendedList from './Recommended/RecommendedList';

export const metadata: Metadata = {
  title: 'Рекомендовані книги - Читозаврик',
};

const RecommendedPage = () => <RecommendedList />;

export default RecommendedPage;
