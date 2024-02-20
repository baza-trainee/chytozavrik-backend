import React from 'react';
import { Typography } from 'components/common';
import SearchableSelect from '@/app/(admin)/components/SearchableSelect/SearchableSelect';
import BookSearchEdit from '@/app/(admin)/admin/quizzes/components/QuizzesForm/components/BookSearchEdit';
import { ActionMeta, GroupBase, InputActionMeta, SingleValue } from 'react-select';
import styles from '@/app/(admin)/admin/quizzes/components/QuizzesForm/QuizForm.module.scss';

interface QuizBookInputProps {
  onChange: ((newValue: SingleValue<string>, actionMeta: ActionMeta<string>) => void) | undefined;
  onInputChange?: ((newValue: string, actionMeta: InputActionMeta) => void) | undefined;
  clearInput: () => void;
  options: GroupBase<string>[];
  selected: SingleValue<string>;
  inputValue?: SingleValue<string>;
  label: string;
  error?: string;
  id?: number;
  value?: string;
}
const QuizBookInput: React.FC<QuizBookInputProps> = ({
  onChange,
  onInputChange,
  clearInput,
  options,
  selected,
  inputValue,
  label,
  error,
  id,
  value,
}) => (
  <div className={styles.book}>
    <Typography component="h2" variant="h5">
      Книга
    </Typography>
    {id ? (
      <BookSearchEdit value={value && value} />
    ) : (
      <SearchableSelect
        options={options}
        onChange={onChange}
        clearInput={clearInput}
        onInputChange={onInputChange}
        selected={selected}
        inputValue={inputValue}
        label={label}
        error={error}
        loading
      />
    )}
  </div>
);

export default QuizBookInput;
