'use client';

import React, { useState } from 'react';
import { Button } from 'components/common';
import { useForm } from 'react-hook-form';
import { SearchIcon } from 'lucide-react';
import { AddIcon, AdminSearch, CloseIcon } from '@/app/(admin)/components';
import style from './Header.module.scss';

interface AdminHeaderProps {
  withSearch: boolean;
  withButton: boolean;
  withClose: boolean;
  heading: string;
  buttonText?: string;
  subHeading?: string[];
  setSearchWord?: React.Dispatch<React.SetStateAction<string | null>>;
  href?: string;
  closeFunc?: () => void;
}

const AdminHeader = ({
  withSearch = false,
  withButton = false,
  withClose = false,
  heading = '',
  buttonText = '',
  subHeading,
  setSearchWord,
  href,
  closeFunc,
}: AdminHeaderProps) => {
  const { control, setValue, watch } = useForm({
    defaultValues: {
      search: '',
    },
  });
  const resetField = () => {
    setValue('search', '');
    if (setSearchWord) {
      setSearchWord('');
    }
  };
  const searchValue = watch('search');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && setSearchWord) {
      setSearchWord(searchValue);
    }
  };

  return (
    <div className={style.header}>
      <div>
        <h4 className={style.header__heading}>{heading}</h4>
        {subHeading && (
          <p className={style.header__subheading}>
            <span style={{ color: '#1E1E1E' }}>{subHeading[0]}</span> / {subHeading[1]}
          </p>
        )}
      </div>
      <div className={style.header__content}>
        {withSearch ? (
          <div className={style.search}>
            <AdminSearch
              name="search"
              control={control}
              icon={
                <SearchIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (setSearchWord) {
                      setSearchWord(searchValue);
                    }
                  }}
                />
              }
              resetField={resetField}
              placeholder="Введіть ключове слово для пошуку"
              handleKeyDown={handleKeyDown}
            />
          </div>
        ) : null}
        {withButton ? (
          <Button
            variant="filled"
            color="secondary"
            startIcon={<AddIcon />}
            href={href || ''}
            component="link"
          >
            {buttonText}
          </Button>
        ) : null}
        {withClose ? (
          <div onClick={closeFunc} onKeyDown={closeFunc} style={{ cursor: 'pointer' }}>
            <CloseIcon />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminHeader;
