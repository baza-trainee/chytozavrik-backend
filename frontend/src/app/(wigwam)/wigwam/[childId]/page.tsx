import { BooksResponse, BookType, LastquizType, RecBooksResponse } from '@/types';
import { Metadata } from 'next';
import Container from 'components/common/Container/Container';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import {
  getChildBooksService,
  getMonstersService,
  getRecommendationBooksService,
  getWigwamQuizService,
} from '@/services/api';
import {
  RecommendedBooks,
  WigwamBooks,
  WigwamMyMonsters,
  WigwamQuiz,
  WigwamReadBooks,
} from '../../components/Wigwam';
import styles from './wigwam.module.scss';

export const metadata: Metadata = {
  title: 'Твій вігвам - Читозаврик',
};

interface WigwamProps {
  params: { childId: string };
}

const Wigwam = async ({ params: { childId } }: WigwamProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['monsters', childId],
    queryFn: () => getMonstersService(childId),
  });

  const childBooks: BooksResponse = await queryClient.fetchQuery({
    queryKey: ['childBooks', childId],
    queryFn: () => getChildBooksService(childId),
  });

  const recommendedBooks: RecBooksResponse = await queryClient.fetchQuery({
    queryKey: ['recommendedBooks', childId],
    queryFn: getRecommendationBooksService,
  });

  const wigwamQuiz: LastquizType = await queryClient.fetchQuery({
    queryKey: ['wigwamQuiz', childId],
    queryFn: () => getWigwamQuizService(childId),
  });

  const selectedBook =
    childBooks.results.find(book => book.id === parseInt(wigwamQuiz?.last_quiz_id || '', 10)) ||
    ({} as BookType);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Container className={styles.layout}>
        <WigwamReadBooks wigwamQuizItem={wigwamQuiz} />
        {childBooks.results.length > 0 && wigwamQuiz && (
          <WigwamQuiz wigwamQuizItem={wigwamQuiz} booksItem={selectedBook} />
        )}
        <WigwamMyMonsters childId={childId} />
        <WigwamBooks
          booksData={childBooks.results}
          wigwamQuizData={wigwamQuiz}
          next={childBooks.next}
        />
        <div className={styles.test}>
          <RecommendedBooks
            recBooksData={recommendedBooks.results}
            booksData={childBooks.results}
          />
        </div>
      </Container>
    </HydrationBoundary>
  );
};

export default Wigwam;
