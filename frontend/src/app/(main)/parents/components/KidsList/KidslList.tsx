'use client';

import { useState } from 'react';
import { ChildType } from '@/types';
import { Container, Typography, Spinner } from '@/components/common';
import KidProfile from '../KidProfile';
import styles from './KidList.module.scss';
import NoteKid from '../NoteKid';

type Props = {
  kids: ChildType[];
  isLoading: boolean;
};

const KidslList = ({ kids, isLoading }: Props) => {
  const [showNote, setShowNote] = useState(true);
  const closeNote = () => {
    setShowNote(false);
  };

  return (
    <div className={styles.section}>
      <Container className={styles.container}>
        <Typography className={styles.title} component="h2" variant="h2">
          Вігвами дітей
        </Typography>

        {isLoading && (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        )}
        {kids && kids.length >= 1 && (
          <>
            <ul className={styles.list}>
              {kids.map((kid: ChildType) => (
                <KidProfile key={kid.id} kid={kid} />
              ))}
            </ul>
            {kids.length === 1 && showNote && <NoteKid closeNote={closeNote} />}
          </>
        )}

        {kids && kids.length === 0 && (
          <p className={styles.text}>У вас поки немає створеного вігваму</p>
        )}
      </Container>
    </div>
  );
};

export default KidslList;
