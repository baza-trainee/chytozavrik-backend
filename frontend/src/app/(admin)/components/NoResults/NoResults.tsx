import React from 'react';
import Image from 'next/image';
import styles from './NoResults.module.scss';

const NoResults = ({ text, image }: { text: string; image: string }) => (
  <div className={styles.wrapper}>
    <div>
      <Image src={image} alt="немає результатів" width={199} height={199} />
    </div>
    <p className={styles.text}>{text}</p>
  </div>
);

export default NoResults;
