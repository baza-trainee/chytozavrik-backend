import React from 'react';
import Image from 'next/image';
import { Typography } from 'components/common';
import styles from '@/app/(admin)/components/NoResults/NoResults.module.scss';

const NoSearchResults = () => (
  <div className={styles.container}>
    <div>
      <Image
        src="/images/admin/search-no-res.svg"
        alt="немає результатів пошуку"
        width={199}
        height={199}
      />
    </div>
    <div className={styles.message}>
      <Typography variant="h5" component="h2">
        По вашому запиту нічого не знайдено.{' '}
      </Typography>
      <Typography variant="body" component="p">
        Спробуйте сформулювати запит інакше або скористайтеся іншими ключовими словами{' '}
      </Typography>
    </div>
  </div>
);

export default NoSearchResults;
