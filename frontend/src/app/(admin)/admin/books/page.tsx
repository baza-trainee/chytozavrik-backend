import React from 'react';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getBooksService } from '@/services/api';
import BooksList from '@/app/(admin)/admin/books/components/BooksList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Книги - Читозаврик',
};

const BooksPage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['books'],
    // @ts-expect-error
    queryFn: getBooksService,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BooksList />
    </HydrationBoundary>
  );
};

export default BooksPage;
