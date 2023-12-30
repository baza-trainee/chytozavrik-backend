import React from 'react';
import { Metadata } from 'next';
import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getActiveChildsService,
  getChildsService,
  getQuizzesService,
  getUsersService,
} from '@/services/api';
import { ChartUsers, ChartChilds, ChartActiveChilds, ChartQuizzes } from '@/types';
import { AdminHeader } from '@/app/(admin)/components';
import UserChart from './components/UserChart';
import ChildChart from './components/ChildChart';
import ActiveChildChart from './components/ActiveChildChart';
import QuizzesChart from './components/QuizzesChart';
import styles from './Statistics.module.scss';

export const metadata: Metadata = {
  title: 'Статистика - Читозаврик',
};

const Statistics = async () => {
  const queryClient = new QueryClient();
  const limit = 7;

  const usersResponse = await queryClient.fetchQuery({
    queryKey: ['users'],
    queryFn: getUsersService,
  });
  const users: ChartUsers[] = Array.isArray(usersResponse) ? usersResponse : [];

  const childsResponse = await queryClient.fetchQuery({
    queryKey: ['childs'],
    queryFn: getChildsService,
  });
  const childs: ChartChilds[] = Array.isArray(childsResponse) ? childsResponse : [];

  const activeChildsResponse = await queryClient.fetchQuery({
    queryKey: ['activeChilds'],
    queryFn: getActiveChildsService,
  });
  const activeChilds: ChartActiveChilds[] = Array.isArray(activeChildsResponse)
    ? activeChildsResponse
    : [];

  const quizzesResponse = await queryClient.fetchQuery({
    queryKey: ['quizzes'],
    queryFn: getQuizzesService,
  });
  const quizzes: ChartQuizzes[] = Array.isArray(quizzesResponse) ? quizzesResponse : [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.statistics}>
        <AdminHeader withSearch={false} withButton={false} withClose={false} heading="Статистика" />
        <UserChart users={users?.slice(-limit) || []} />
        <ChildChart childs={childs?.slice(-limit) || []} />
        <ActiveChildChart activeChilds={activeChilds?.slice(-limit) || []} />
        <QuizzesChart quizzes={quizzes?.slice(-50) || []} />
      </div>
    </HydrationBoundary>
  );
};

export default Statistics;
