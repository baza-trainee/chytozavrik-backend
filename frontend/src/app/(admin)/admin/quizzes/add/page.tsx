import { Metadata } from 'next';
import AddQuiz from '@/app/(admin)/admin/quizzes/add/components/AddQuiz';

export const metadata: Metadata = {
  title: 'Додати вікторину - Читозаврик',
};

const AddQuizzesPage = () => <AddQuiz />;

export default AddQuizzesPage;
