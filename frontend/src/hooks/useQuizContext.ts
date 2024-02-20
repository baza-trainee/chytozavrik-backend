import { createContext, ReactNode, useContext, useState } from 'react';

interface QuizContextType {
  isCloseQuiz: boolean;
  setIsCloseQuiz: (isCloseQuiz: boolean) => void;
  isAnswerModal: boolean;
  setIsAnswerModal: (isAnswerModal: boolean) => void;
}

export const QuizContext = createContext<QuizContextType>({
  isCloseQuiz: false,
  setIsCloseQuiz: () => {},
  isAnswerModal: false,
  setIsAnswerModal: () => {},
});

const useQuizContext = () => useContext(QuizContext);

export { useQuizContext };
