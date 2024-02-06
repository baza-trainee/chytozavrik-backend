'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { AlertCircle, File as FileIcon } from 'lucide-react';
import { Button } from 'components/common';
import { Document } from '@/types/Documents';
import { formattedDate } from '@/utils/formatDate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Modal from 'components/common/ModalActions/Modal';
import * as process from 'process';
import styles from './DocumentItem.module.scss';

const DocumentItem = ({ id, name, updated_at: updated }: Document) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errorFile, setErrorFile] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDiscard, setIsDiscard] = useState(false);
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || '';
  const {
    mutate: submitDocument,
    error,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      await axios.patch(`${BASE_URL}/documents/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${session?.user.token.access}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsSuccess(true);
    },
  });
  const MAX_SIZE = 2 * 1024 * 1024;
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setErrorFile('');

      if (file.size > MAX_SIZE) {
        setErrorFile('Максимальний ліміт розміру файлу 2 Мб');
      } else {
        setFile(file);
      }
    }
  };
  const openFileSelector = () => {
    fileInputRef.current?.click();
    setIsOpen(true);
  };

  return (
    <div className={`${styles.wrapper} ${isOpen ? styles.active : ''}`}>
      <div className={styles.document}>
        <div>
          <div className={styles.info}>
            <div className={styles.icon}>
              <FileIcon />
            </div>
            <p className={styles.title}>{file ? file.name : name}</p>
          </div>
          {errorFile && (
            <div className={styles.error}>
              <div>
                <AlertCircle color="#F40000" size={14} />
              </div>
              {errorFile}
            </div>
          )}
        </div>
        <div className={styles.date}>{formattedDate(updated)}</div>
        <Button variant="outline" onClick={openFileSelector} disabled={isOpen && !errorFile}>
          Замінити файл
        </Button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
      {isOpen && (
        <div className={styles.buttons}>
          <Button variant="outline" onClick={() => setIsDiscard(true)} disabled={isPending}>
            Скасувати
          </Button>
          <Button
            type="submit"
            variant="filled"
            color="secondary"
            disabled={isPending || !!errorFile}
            onClick={() => submitDocument()}
          >
            Оновити
          </Button>
        </div>
      )}
      {(isSuccess || isDiscard) && (
        <Modal
          type={isDiscard ? 'question' : 'success'}
          message={
            isDiscard
              ? 'Ви точно хочете скасувати зміни? Вони не будуть збережені'
              : 'Ваші зміни успішно збережено!'
          }
          title={isDiscard ? 'Повернутись' : 'Збережено!'}
          active={isDiscard || isSuccess}
          setActive={() => {
            setIsSuccess(false);
            setIsDiscard(false);
            setIsOpen(false);
          }}
          successFnc={() => {
            setIsOpen(false);
            setFile(null);
            setErrorFile('');
          }}
        />
      )}
      {error && <div style={{ color: '#F40000', fontSize: '16px' }}>Помилка: {error.message}</div>}
    </div>
  );
};

export default DocumentItem;
