export interface BookAdmin {
  book_id: number;
  quizz_id: number;
  id: number;
  state: string | string[];
  created_at: string;
  updated_at: string;
  title: string;
  author: string;
  cover_image: string;
  is_recommended: boolean;
}

export interface BookAdminProps {
  book: BookAdmin;
  page: 'books' | 'quizzes' | 'recommended';
  onCheckboxChange: (checked: boolean, bookId: number) => void;
  isDeleting: boolean;
}
