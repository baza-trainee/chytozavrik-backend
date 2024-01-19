'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Avatar1 from 'public/images/kids-avatar1.svg';
import Avatar2 from 'public/images/kids-avatar2.svg';
import Avatar3 from 'public/images/kids-avatar3.svg';
import Avatar4 from 'public/images/kids-avatar4.svg';
import Avatar5 from 'public/images/kids-avatar5.svg';
import Avatar6 from 'public/images/kids-avatar6.svg';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import styles from './AvatarFields.module.scss';

interface AvatarFieldsetProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  selectedAvatar: number;
}

const AvatarFields = ({ register, errors, selectedAvatar }: AvatarFieldsetProps) => {
  const avatarData = [
    { id: 1, image: Avatar1 },
    { id: 2, image: Avatar2 },
    { id: 3, image: Avatar3 },
    { id: 4, image: Avatar4 },
    { id: 5, image: Avatar5 },
    { id: 6, image: Avatar6 },
  ];
  const [currentAvatar, setCurrentAvatar] = useState(selectedAvatar);

  const handleAvatarChange = (id: number): void => {
    setCurrentAvatar(id);
  };

  return (
    <div className={styles.container}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.text}>Оберіть аватар</legend>
        <div className={styles.radioWrapper}>
          {avatarData.map(({ id, image }) => (
            <React.Fragment key={id}>
              <input
                {...register('avatar', { required: true })}
                type="radio"
                id={String(id)}
                name="avatar"
                className={styles.radio}
                value={String(id)}
                checked={id === currentAvatar}
                onChange={() => handleAvatarChange(id)}
              />
              <label htmlFor={String(id)}>
                <Image src={image} alt="аватар дитини" className={styles.image} />
              </label>
            </React.Fragment>
          ))}
        </div>
      </fieldset>
      {errors.avatar && <span className={styles.error}>Оберіть аватар</span>}
    </div>
  );
};

export default AvatarFields;
