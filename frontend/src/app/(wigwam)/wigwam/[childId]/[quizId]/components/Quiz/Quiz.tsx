'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import type { QuizInfoResponse } from '@/types';
import questionImage from 'public/images/quiz-page/quiz-question-image.svg';
import { Typography } from '@/components/common';
import CloseQuizButton from '@/app/(wigwam)/wigwam/[childId]/[quizId]/components/CloseQuizButton/CloseQuizButton';
import { QuizContext } from '@/hooks/useQuizContext';
import AnswersList from './AnswersList';
import QuizPrize from '../QuizPrize';
import styles from './Quiz.module.scss';

interface QuizProps {
  quizInfo: QuizInfoResponse;
}

const Quiz = ({ quizInfo }: QuizProps) => {
  const {
    questions,
    book_info: { author: bookAuthor, name: bookName },
    score,
  } = quizInfo;
  const [questionNumber, setQuestionNumber] = useState(() =>
    score >= questions.length ? 0 : score
  );
  const [quizPrize, setQuizPrize] = useState<string | undefined>(undefined);
  const currentQuestion = questions.at(questionNumber);
  const [isCloseQuiz, setIsCloseQuiz] = useState(false);
  const [isAnswerModal, setIsAnswerModal] = useState(false);
  console.log('questionNumber', questionNumber);
  console.log('currentQuestion', currentQuestion);
  const nextStep = (prize?: string) => {
    if (prize) {
      return setQuizPrize(prize);
    }
    setQuestionNumber(prev => prev + 1);
  };

  const replyQuiz = () => {
    setQuestionNumber(0);
    setQuizPrize(undefined);
  };

  const contextValue = useMemo(
    () => ({
      isCloseQuiz,
      setIsCloseQuiz,
      isAnswerModal,
      setIsAnswerModal,
    }),
    [isCloseQuiz, setIsCloseQuiz, isAnswerModal, setIsAnswerModal]
  );

  const isAnswerNotification = questionNumber;

  return (
    <QuizContext.Provider value={contextValue}>
      <section className={styles.section}>
        <div className={styles.container}>
          {quizPrize ? (
            <QuizPrize prize={quizPrize} onReplyQuiz={replyQuiz} />
          ) : (
            <>
              <CloseQuizButton className={styles['close-button']} />
              <div className={styles.header}>
                <Typography className={styles['question-count']} component="h3" variant="h3">
                  Питання {questionNumber + 1}/{questions.length}
                </Typography>
                <div className={styles['book-info']}>
                  <Typography className={styles['book-name']} component="h3" variant="h3">
                    {bookName}
                  </Typography>
                  <Typography className={styles['book-author']} component="p" variant="body">
                    {bookAuthor}
                  </Typography>
                </div>
              </div>
              <div className={styles.body}>
                <Image
                  className={styles['body-image']}
                  src={questionImage}
                  alt="Зображення читозаврика"
                />
                <Typography className={styles.question} component="h2" variant="h2">
                  {currentQuestion?.text}
                </Typography>
              </div>
              <div className={styles.footer}>
                <AnswersList
                  questionId={currentQuestion?.id as number}
                  answers={currentQuestion?.answers}
                  onNext={nextStep}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </QuizContext.Provider>
  );
};

export default Quiz;
