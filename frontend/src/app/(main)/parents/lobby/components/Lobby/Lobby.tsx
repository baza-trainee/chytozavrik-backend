'use client';

import { useEffect, useState } from 'react';
import { Container, Spinner } from 'components/common';
import NoWigwams from '@/app/(main)/parents/lobby/components/Lobby/NoWigwams';
import WigwamsList from '@/app/(main)/parents/lobby/components/Lobby/WigwamsList';
import { useFetchChildren } from '@/hooks/Lobby/useFetchChildrens';
import styles from './Lobby.module.scss';

const Lobby = () => {
  const { children, isLoading } = useFetchChildren();
  const [isFetchingStarted, setIsFetchingStarted] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsFetchingStarted(true);
    }
  }, [isLoading]);
  let content;

  if (isLoading) {
    content = (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  } else if (isFetchingStarted && children.length === 0) {
    content = <NoWigwams />;
  } else if (children) {
    content = <WigwamsList users={children} />;
  }

  return (
    <section className={styles.section}>
      <Container className={styles.container}>{content}</Container>
    </section>
  );
};

export default Lobby;
