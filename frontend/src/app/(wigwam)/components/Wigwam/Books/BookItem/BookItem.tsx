import React, { FC } from 'react';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import Tick from 'public/images/tick.svg';
import { BookType, LastquizType } from '@/types';
import { useRouter } from 'next/navigation';
import { useIconAndColor } from '@/app/(wigwam)/wigwam/hooks/useIconAndColor';
import { useMedia } from '@/hooks';
import styles from '../WigwamBooks.module.scss';

interface BookItemProps {
  item: BookType;
  selectedBooks: { [key: string]: boolean };
  booksData?: BookType[] | undefined;
  wigwamQuizData: LastquizType | undefined;
  index: number;
}

const BookItem: FC<BookItemProps> = ({
  item,
  selectedBooks,
  wigwamQuizData,
  booksData = [],
  index,
}) => {
  const router = useRouter();
  const firstChar = item.current_score ? item.current_score.charAt(0) : '';
  const firstCharInt = parseInt(firstChar, 10);
  const { colorText, icon } = useIconAndColor(firstCharInt);
  const { deviceType } = useMedia();

  const book = booksData?.[index]?.book;
  const quizId = booksData?.[index]?.id;

  const handleClick = () => {
    if (book?.id && quizId && wigwamQuizData) {
      const childId = wigwamQuizData.id;
      router.push(`/wigwam/${childId}/${quizId}`);
    } else {
      router.push('/');
    }
  };

  const renderIcon = () => {
    const isBookSelected = selectedBooks[item.id] || item.current_score === '5/5';

    if (isBookSelected) {
      return (
        <Image
          priority
          src={Tick}
          alt="tick icon"
          width={24}
          height={24}
          className={styles.arrow}
          onClick={deviceType === 'mobile' ? undefined : handleClick}
        />
      );
    }
    return (
      <div className={styles.arrow} onClick={deviceType === 'mobile' ? undefined : handleClick}>
        <MoveRight />
      </div>
    );
  };

  return (
    <div className={styles.book_items} onClick={deviceType === 'mobile' ? handleClick : undefined}>
      <div className={styles.book_about}>
        <p className={styles.book_name}>{item.book.title}</p>
        <p className={styles.book_author}>{item.book.author}</p>
        <div className={styles.book_counter_wraper}>
          <Image priority src={icon} alt="brain icon" width={18} height={18} />
          <p className={styles.book_counter} style={{ color: colorText }}>
            {item.current_score || '0/0'}
          </p>
        </div>
      </div>
      {renderIcon()}
    </div>
  );
};

export default BookItem;
