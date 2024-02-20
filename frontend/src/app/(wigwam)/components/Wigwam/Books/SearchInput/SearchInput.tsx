'use client';

import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Search, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import styles from '@/app/(wigwam)/components/Wigwam/Books/WigwamBooks.module.scss';

interface SearchInputProps {
  setSearchValue: Dispatch<SetStateAction<string>>;
}

const defaultValues = {
  search: '',
};

const SearchInput = ({ setSearchValue }: SearchInputProps) => {
  const { watch, register, setValue } = useForm({
    defaultValues,
  });
  const searchTerm = watch('search');

  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm, setSearchValue]);

  const clearSearch = () => {
    setValue('search', '');
  };

  return (
    <div className={styles.search_wraper}>
      <form autoComplete="off" className={styles.form}>
        <div className={styles.icon_wraper}>
          <Search className={styles.icon} stroke="#7791FA" />
        </div>
        <input
          {...register('search', {
            required: true,
          })}
          name="search"
          className={styles.input}
          placeholder="Швидкий пошук книги"
        />
        {searchTerm && (
          <div className={styles.icon_circle} onClick={clearSearch}>
            <XCircle className={styles.icon} stroke="#7791FA" />
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchInput;
