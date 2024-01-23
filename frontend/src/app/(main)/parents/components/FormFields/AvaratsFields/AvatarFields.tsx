'use client';

import React, { useEffect, useState } from 'react';
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
  const [currentAvatar, setCurrentAvatar] = useState(0);

  useEffect(() => {
    setCurrentAvatar(selectedAvatar);
  }, [selectedAvatar]);

  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
  }

  const handleAvatarChange = (id: number): void => {
    setCurrentAvatar(id);
  };

  const imageCheckedStyles = {
    border: '3px solid #455fc8',
    borderRadius: '100px',
  };


  const imageStyleChangeHandler = (id: number): void  => {
    if (isSafari()) {
      setCurrentAvatar(id);
    }
  }


  return (
    <div className={styles.container}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.text}>Оберіть аватар</legend>
        <div className={styles.radioWrapper}>
          {avatarData.map(({ id, image }) => (
            <React.Fragment key={id}>
              <label htmlFor={String(id)}>
                {isSafari() ?
                  <input
                    {...register('avatar', { required: true })}
                    type='radio'
                    id={String(id)}
                    name='avatar'
                    className={styles.radio}
                    value={String(id)}
                    checked={id === currentAvatar}
                    onClick={() => handleAvatarChange(id)}
                  />
                  : <input
                    {...register('avatar', { required: true })}
                    type='radio'
                    id={String(id)}
                    name='avatar'
                    className={styles.radio}
                    value={String(id)}
                    checked={id === currentAvatar}
                    onChange={() => handleAvatarChange(id)}
                  />
                }
                <Image src={image} alt="аватар дитини" className={styles.image} style={(currentAvatar === id) ? imageCheckedStyles : {}} />
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
