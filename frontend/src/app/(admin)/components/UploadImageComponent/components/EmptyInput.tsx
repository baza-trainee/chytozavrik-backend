import React from 'react';
import Image from 'next/image';
import { Typography } from 'components/common';
import styles from '@/app/(admin)/components/UploadImageComponent/UploadImage.module.scss';

const EmptyInput = ({
  sizeErrorMessage,
  formatErrorMessage,
}: {
  sizeErrorMessage: string;
  formatErrorMessage: string;
}) => (
  <div className={styles.uploadInfoContainer}>
    <Image src="/images/admin/Image-icon.svg" alt="image icon" width={51} height={43} />
    <Typography component="span" variant="body">
      Перетягніть свій файл сюди або
    </Typography>
    <Typography component="span" variant="body" className={styles.blueText}>
      натисніть щоб завантажити
    </Typography>

    {/* Showing error messages */}
    {(sizeErrorMessage || formatErrorMessage) && (
      <div className={styles.errorMessageContainer}>
        {sizeErrorMessage && (
          <Typography component="span" variant="body" className={styles.errorMessage}>
            {sizeErrorMessage}
          </Typography>
        )}
        {formatErrorMessage && (
          <Typography component="span" variant="body" className={styles.errorMessage}>
            {formatErrorMessage}
          </Typography>
        )}
      </div>
    )}

    {/* Displaying info upload reminder depending on the error message */}
    {(sizeErrorMessage && formatErrorMessage) || (!sizeErrorMessage && !formatErrorMessage) ? (
      <div className={styles.formatAndSizeWarning}>
        <Typography component="span" variant="body">
          Формат зображення: JPG, PNG, SVG
        </Typography>
        <Typography component="span" variant="body">
          Максимальний розмір: 2 MB
        </Typography>
      </div>
    ) : null}
    {sizeErrorMessage && !formatErrorMessage && (
      <Typography component="span" variant="body">
        Максимальний розмір: 2 MB
      </Typography>
    )}
    {!sizeErrorMessage && formatErrorMessage && (
      <Typography component="span" variant="body">
        Формат зображення: JPG, PNG, SVG
      </Typography>
    )}
  </div>
);

export default EmptyInput;
