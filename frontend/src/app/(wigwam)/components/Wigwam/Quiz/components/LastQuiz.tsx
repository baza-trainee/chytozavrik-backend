import React from 'react';
import wigwamTextData from '@/app/(wigwam)/components/Wigwam/wigwamTextData.json';
import { Button } from 'components/common';
import { usePathname } from 'next/navigation';
import { WigwamQuizProps } from '@/app/(wigwam)/components/Wigwam/Quiz/WigwamQuiz';
import Bolt from 'public/images/wigwam/bolt.svg';
import styles from '@/app/(wigwam)/components/Wigwam/Quiz/WigwamQuiz.module.scss';
import Image from 'next/image';

const LastQuiz: React.FC<WigwamQuizProps> = ({ booksItem, wigwamQuizItem }) => {
  const pathname = usePathname();

  const lastQuizId: string | null | undefined = wigwamQuizItem?.last_quiz_id || null;
  const lastQuizScore = booksItem.current_score;
  let lastQuizTitle: string | undefined;
  let lastQuizAuthor: string | undefined;

  if (booksItem.id === parseInt(wigwamQuizItem?.last_quiz_id || '', 10)) {
    lastQuizTitle = booksItem?.book?.title;
    lastQuizAuthor = booksItem?.book?.author;
  }

  const onNextQuiz = () => {
    window.location.href = `${pathname}/${lastQuizId}`;
  };

  return (
    <section className={styles.last_wraper}>
      <div className={styles.last_box}>
        <p className={styles.last_text}>{wigwamTextData[0]}</p>
        <div className={styles.text_wraper}>
          <p className={styles.hidden_text}>Last Quiz ID: {lastQuizId}</p>
          <p className={styles.book_name}>{lastQuizTitle}</p>
          <p className={styles.book_author}>{lastQuizAuthor}</p>
        </div>

        <ul className={styles.status_bar}>
          {[...Array(5)].map((_, index) => (
            <li
              key={index}
              className={styles.bolt}
              style={{
                backgroundColor:
                  lastQuizScore && index < parseInt(lastQuizScore.charAt(0), 10) ? '#7AF19C' : '',
              }}
            >
              <Image src={Bolt} alt="bolt" />
            </li>
          ))}
        </ul>
      </div>
      <Button
        className={styles.button}
        variant="filled"
        color="secondary"
        size="big"
        component="button"
        onClick={onNextQuiz}
      >
        {wigwamTextData[4]}
      </Button>
    </section>
  );
};

export default LastQuiz;
