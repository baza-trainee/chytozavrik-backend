import { notFound } from 'next/navigation';
import type { AttemptsInfoResponse, QuizInfoResponse } from '@/types';
import { fetch } from '@/services/axios';
import Quiz from './components/Quiz';

interface QuizPageProps {
  params: {
    quizId: string;
    childId: string;
  };
}

const QuizPage = async ({ params: { quizId, childId } }: QuizPageProps) => {
  const quizInfoReq = fetch<QuizInfoResponse>(`/quizzes/${quizId}`);
  const attemptsInfoReq = fetch<AttemptsInfoResponse>(
    `/users/me/children/${childId}/attempts/${quizId}/`
  );
  const [quizInfoRes, attemptsInfoRes] = await Promise.all([quizInfoReq, attemptsInfoReq]);

  if (quizInfoRes.status === 'fail' || attemptsInfoRes.status === 'fail') notFound();

  const quizInfo: QuizInfoResponse = { ...quizInfoRes.data, ...attemptsInfoRes.data };

  return <Quiz quizInfo={quizInfo} />;
};

export default QuizPage;
