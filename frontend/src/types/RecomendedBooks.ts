export interface RecBookType {
  id: number;
  state: string[];
  created_at: string;
  updated_at: string;
  title: string;
  author: string;
  cover_image: string;
  is_recommended: boolean;
}

export interface RecBooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RecBookType[];
  message: string;
}

export interface ErrorType {
  message: string;
}
