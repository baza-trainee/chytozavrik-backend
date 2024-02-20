import React from 'react';
import MonstersList from '@/app/(wigwam)/wigwam/[childId]/awards/components/MonstersList';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getMonstersService } from '@/services/api';
import { Metadata } from 'next';

type Props = {
  params: {
    childId: string;
  };
};

export const metadata: Metadata = {
  title: 'Твої Читозаврики',
};

const Awards = async ({ params: { childId } }: Props) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['monsters', childId],
    queryFn: () => getMonstersService(childId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MonstersList childId={childId} />
    </HydrationBoundary>
  );
};

export default Awards;
