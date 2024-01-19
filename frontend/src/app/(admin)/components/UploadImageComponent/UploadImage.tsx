'use client';

import React, { Dispatch, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import FileInput from '@/app/(admin)/components/UploadImageComponent/components/FileInput';
import EmptyInput from '@/app/(admin)/components/UploadImageComponent/components/EmptyInput';
import styles from './UploadImage.module.scss';

interface UploadImageProps {
  onFileChange: (file: File | null) => void;
  file: File | null;
  maxSize?: number;
  allowedTypes?: string[];
  initialImg: string;
  setInitialImg?: Dispatch<React.SetStateAction<string>>;
  page: 'books' | 'partners' | 'quizzes';
  isFilled?: () => boolean;
}

const twoMB = 2 * 1024 * 1024;
const fileTypes = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/svg',
  'image/svg-xml',
  'image/jpg',
  'image/webp',
];

const UploadImage: React.FC<UploadImageProps> = ({
  onFileChange,
  maxSize = twoMB,
  allowedTypes = fileTypes,
  file,
  initialImg,
  setInitialImg,
  page,
  isFilled,
}) => {
  const [sizeErrorMessage, setSizeErrorMessage] = useState<string>('');
  const [formatErrorMessage, setFormatErrorMessage] = useState<string>('');

  const validateSizeError = (file: File) => {
    const isTooBig = file.size > maxSize;

    if (isTooBig) {
      setSizeErrorMessage(
        `${file.name} перевищує максимальний ліміт розміру файлу для цього сайту.`
      );
      return false;
    }
    return true;
  };

  const validateFormatError = (file: File) => {
    const isCorrectFormat = allowedTypes.includes(file.type);

    if (!isCorrectFormat) {
      setFormatErrorMessage(`${file.name} не відповідний формат завантаженого файлу.`);
      return false;
    }
    return true;
  };

  const validateImage = (file: File) => {
    const isValidSize = validateSizeError(file);
    const isValidFormat = validateFormatError(file);

    return isValidFormat && isValidSize;
  };

  const handleChange = (file: File) => {
    setSizeErrorMessage('');
    setFormatErrorMessage('');
    onFileChange(null);

    if (validateImage(file)) {
      onFileChange(file);
    }
  };

  const pageClass = {
    books: styles.books,
    partners: styles.partners,
    quizzes: styles.quizzes,
  };

  return (
    <div>
      <FileUploader
        classes={
          isFilled && isFilled()
            ? [styles.imageInput, styles.validatedInput, pageClass[page]].join(' ')
            : [styles.imageInput, pageClass[page]].join(' ')
        }
        name="file"
        handleChange={handleChange}
        fileOrFiles={file}
      >
        {file || initialImg ? (
          <FileInput
            initialImg={initialImg}
            file={file}
            onFileChange={onFileChange}
            setInitialImg={setInitialImg}
          />
        ) : (
          <EmptyInput sizeErrorMessage={sizeErrorMessage} formatErrorMessage={formatErrorMessage} />
        )}
      </FileUploader>
      {isFilled && isFilled() && <p className={styles.validation}>Будь ласка, заповніть поле</p>}
    </div>
  );
};

export default UploadImage;
