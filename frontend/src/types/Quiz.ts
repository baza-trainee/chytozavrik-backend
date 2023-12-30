export type AnswerType = {
  is_answer_correct: boolean;
  child_reward_url: string | null;
};

export type BookInfoType = {
  name: string;
  author: string;
};

export type QuestionAnswerType = {
  id: number;
  text: string;
  is_true: boolean;
};

export type QuestionType = {
  id: number;
  text: string;
  answers: QuestionAnswerType[];
};

export type Quiz = {
  book_id: number;
  quizz_id: number;
  created_at: string;
  updated_at: string;
  title: string;
  author: string;
  cover_image: string;
  is_recommended: boolean;
};

export type Book = {
  id: number;
  title: string;
  author: string;
  cover_image: string;
};

export interface UsersQuiz {
  id: number;
  current_score: string;
  book: Book;
}

export interface QuizInfoResponse {
  id: number;
  questions: QuestionType[];
  book_info: BookInfoType;
  score: number;
}

export interface AllQuizzesResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: Quiz[];
}

export interface UsersQuizzesResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: UsersQuiz[];
}

// Enums QuizCategory
export enum QuizCategory {
  All = '',
  Started = 'is_started=true',
  Completed = 'is_completed=true',
}
