'use client';

import React, { useState, useEffect } from 'react';
import { Spinner, Typography } from 'components/common';
import Image from 'next/image';
import moveRight from 'public/images/move-right.svg';
import lockedIcon from 'public/images/locked.svg';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia, useFetchMonsters } from '@/hooks';
import wigwamTextData from '../wigwamTextData.json';
import styles from './WigwamMyMonsters.module.scss';

const WigwamMyMonsters = ({ childId }: { childId: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { deviceType } = useMedia();
  const [count, setCount] = useState(0);
  const { monsters, isLoading, error } = useFetchMonsters(childId);

  useEffect(() => {
    if (deviceType === 'desktop') {
      setCount(8);
    } else if (deviceType === 'laptop') {
      setCount(7);
    } else {
      setCount(6);
    }
  }, [deviceType]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.headlineWrapper}>
        <Typography component="h2" variant="h2" className={styles.title}>
          {wigwamTextData[9]}
        </Typography>
        <Image
          priority
          src={moveRight}
          alt="arrow"
          width={24}
          height={24}
          onClick={() => router.push(`${pathname}/awards`)}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className={styles.monstersContainer}>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        ) : (
          <>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className={styles.monsterWrapper}>
                {monsters && monsters[i] ? (
                  <Image
                    width={80}
                    height={80}
                    src={monsters[i].reward}
                    alt="Читозаврик"
                    className={styles.monsterPresent}
                  />
                ) : (
                  <Image src={lockedIcon} alt="icon locked" className={styles.monsterEmpty} />
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default WigwamMyMonsters;
