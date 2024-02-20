import React from 'react';
import EditQuiz from '@/app/(admin)/admin/quizzes/edit/[id]/components/EditQuiz';

interface EditQuizPageProps {
  params: { id: number };
}

const Page = ({ params: { id } }: EditQuizPageProps) => <EditQuiz id={id} />;

export default Page;
