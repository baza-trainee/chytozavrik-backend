'use client';

import React from 'react';
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
}

const AvatarFields = ({ register, errors }: AvatarFieldsetProps) => (
  <div className={styles.container}>
    <fieldset className={styles.fieldset}>
      <legend className={styles.text}>Оберіть аватар</legend>
      <div className={styles.radioWrapper}>
        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="1"
          name="avatar"
          className={styles.radio}
          value=" 1"
        />
        <label htmlFor="1">
          <Image src={Avatar1} alt="аватар дитини" className={styles.image} />
        </label>
        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="2"
          name="avatar"
          className={styles.radio}
          value="2"
        />
        <label htmlFor="2">
          <Image src={Avatar2} alt="аватар дитини" className={styles.image} />
        </label>
        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="3"
          name="avatar"
          className={styles.radio}
          value="3"
        />
        <label htmlFor="3">
          <Image src={Avatar3} alt="аватар дитини" className={styles.image} />
        </label>

        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="4"
          name="avatar"
          className={styles.radio}
          value="4"
        />
        <label htmlFor="4">
          <Image src={Avatar4} alt="аватар дитини" className={styles.image} />
        </label>

        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="5"
          name="avatar"
          className={styles.radio}
          value="5"
        />
        <label htmlFor="5">
          <Image src={Avatar5} alt="аватар дитини" className={styles.image} />
        </label>

        <input
          {...register('avatar', { required: true })}
          type="radio"
          id="6"
          name="avatar"
          className={styles.radio}
          value="6"
        />
        <label htmlFor="6">
          <Image src={Avatar6} alt="аватар дитини" className={styles.image} />
        </label>
      </div>
    </fieldset>
    {errors.avatar && <span className={styles.error}>Оберіть аватар</span>}
  </div>
);

export default AvatarFields;
