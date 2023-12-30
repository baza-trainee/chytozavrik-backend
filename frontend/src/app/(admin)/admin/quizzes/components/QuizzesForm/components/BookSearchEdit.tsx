import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from '../QuizForm.module.scss';

const BookSearchEdit = ({ value }: { value?: string }) => (
  <div className={styles.bookSearch}>
    <label>
      <span>Назва книги</span>
      <div className={styles.input}>
        <input type="text" value={value} disabled />
        <ChevronDown />
      </div>
    </label>
  </div>
);

export default BookSearchEdit;
