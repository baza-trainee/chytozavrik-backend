import React from 'react';
import QuizzesList from '@/app/(admin)/admin/quizzes/components/QuizzesList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вікторини - Читозаврик',
};

const Quizzes = () => <QuizzesList />;

export default Quizzes;
