import React, { Dispatch } from 'react';
import styles from '@/app/(admin)/components/UploadImageComponent/UploadImage.module.scss';
import Image from 'next/image';

const FileInput = ({
  onFileChange,
  file,
  initialImg,
  setInitialImg,
}: {
  onFileChange: (file: File | null) => void;
  file: File | null;
  initialImg: string;
  setInitialImg?: Dispatch<React.SetStateAction<string>>;
}) => {
  const src = file ? URL.createObjectURL(file) : initialImg;

  const deleteImgHandler = () => {
    onFileChange(null);
    if (setInitialImg) setInitialImg('');
  };

  return (
    <div className={styles.uploadedImageContainer}>
      <Image
        className={styles.uploadedImage}
        src={src}
        alt="Uploaded Image"
        width={120}
        height={175}
      />
      <button className={styles.closeButton} onClick={deleteImgHandler}>
        <Image src="/images/admin/x.svg" alt="close icon" height={16} width={16} />
      </button>
    </div>
  );
};

export default FileInput;
