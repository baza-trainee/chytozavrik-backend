'use client';

import React, { useState, useEffect } from 'react';
import { Container, Button, Typography } from 'components/common';
import Image from 'next/image';
import Notification from 'components/Notification/Notification';
import cat from 'public/images/cat/cat.svg';
import sad from 'public/images/cat/sad.svg';
import { ChildType } from '@/types';
import styles from './Parents.module.scss';

type Props = {
  handleClick: () => void;

  kids: ChildType[];
};

const Parents = ({ handleClick, kids }: Props) => {
  const [showNote, setShowNote] = useState(true);
  const [showLimit, setShowLimit] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const closeNote = () => {
    setShowNote(false);
    setShowLimit(false);
    setIsDisabled(false);
  };

  return (
    <section className={styles.section}>
      <Container className={styles.container}>
        <Image
          src="/images/avatar-parents.svg"
          className={styles.image}
          alt="аватарка батьків"
          width={106}
          height={106}
        />
        <Button
          color="secondary"
          className={styles.button}
          disabled={isDisabled}
          onClick={event => {
            closeNote();
            if (kids && kids.length >= 6) {
              setShowLimit(true);
              setIsDisabled(true);
            } else handleClick();
          }}
        >
          <Image
            src="/images/wigwam.svg"
            width={24}
            height={24}
            alt="іконка вігваму"
            className={styles.icon}
          />
          <Typography className={styles.text} component="span" variant="h5">
            Створити вігвам
          </Typography>
        </Button>
        {kids && kids.length === 0 && showNote && (
          <Notification
            text="Натисніть сюди, щоб створити ігровий простір для своєї дитини"
            img={cat}
            closeNote={closeNote}
          />
        )}
        {showLimit && (
          <Notification
            closeNote={closeNote}
            text="Вибачте, ви вже створили максимально дозволену кількість вігвамів"
            img={sad}
          />
        )}
      </Container>
    </section>
  );
};

export default Parents;
