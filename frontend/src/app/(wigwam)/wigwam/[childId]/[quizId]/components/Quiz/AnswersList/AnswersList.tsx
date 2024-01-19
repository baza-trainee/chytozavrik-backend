'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { AnswerType, QuestionAnswerType } from '@/types';
import { useFetch } from '@/hooks';
import { Button } from '@/components/common';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorToast, Notification, SuccessToast } from '../../Notification';
import styles from './AnswersList.module.scss';

type Props = {
  questionId: number;
  answers: QuestionAnswerType[] | undefined;
  // eslint-disable-next-line no-unused-vars
  onNext: (prize?: string) => void;
};

type AnswerRequestType = {
  child_id: number;
  answer_id: number;
};

const AnswersList = ({ questionId, answers, onNext }: Props) => {
  const { childId } = useParams();
  const [isShowNotification, setIsShowNotification] = useState(false);
  const [selectAnswer, setSelectAnswer] = useState<number | null>(null);
  const { data: answerResult, isLoading, fetch } = useFetch<AnswerType, AnswerRequestType>();
  const queryClient = useQueryClient();

  const clickHandler = (answerId: number) => async () => {
    setSelectAnswer(answerId);

    try {
      await fetch(
        `quizzes/question/${questionId}/submit-answer/`,
        {
          child_id: Number(childId),
          answer_id: answerId,
        },
        'POST'
      );

      setIsShowNotification(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };

  const closeNotification = () => {
    setSelectAnswer(null);
    setIsShowNotification(false);
  };

  const nextStep = () => {
    if (answerResult?.child_reward_url) {
      onNext(answerResult?.child_reward_url);
      queryClient.invalidateQueries({ queryKey: ['monsters'] });
      queryClient.invalidateQueries({ queryKey: ['wigwamQuiz'] });
    }
    onNext();
    closeNotification();
  };

  if (!answers) return null;

  return (
    <>
      <ul className={styles.list}>
        {answers.map(answer => (
          <li key={answer.id} className={styles.item}>
            <Button
              className={styles.button}
              variant="outline"
              color="primary"
              onClick={clickHandler(answer.id)}
              disabled={isLoading}
              isLoading={isLoading && answer.id === selectAnswer}
              selected={answer.id === selectAnswer}
            >
              {answer.text}
            </Button>
          </li>
        ))}
      </ul>
      {isShowNotification &&
        answerResult &&
        (answerResult.is_answer_correct ? (
          <Notification type="success">
            <SuccessToast onAction={nextStep} />
          </Notification>
        ) : (
          <Notification type="error">
            <ErrorToast onAction={closeNotification} />
          </Notification>
        ))}
    </>
  );
};

export default AnswersList;
