import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Linkedin } from 'lucide-react';
import { Container, Typography } from 'components/common';

import styles from './AdditionalInfo.module.scss';

const AdditionalInfo = () => (
  <section className={styles.section}>
    <Container className={styles.container}>
      <div className={styles.feedbackContainer}>
        <Typography component="h2" variant="h2" className={styles.feedbackTitle}>
          Залиште свій слід у світі читання
        </Typography>
        <Typography component="p" variant="body" className={styles.feedbackText}>
          Ми цінуємо ваш зворотній зв&apos;язок! Ми готові відповісти на ваші питання, вислухати
          ваші пропозиції та разом з вами побудувати захопливий світ читання для дітей!
        </Typography>
      </div>
      <div className={styles.bazaContainer}>
        <Typography component="h2" variant="h2" className={styles.bazaTitle}>
          Про Ba<span className={styles.z}>z</span>a Trainee Ukraine
        </Typography>
        <div className={styles.textWrapper}>
          <Typography component="p" variant="body" className={styles.bazaText}>
            Навчальний проєкт-платформа Baza Trainee Ukraine надає можливість кожному, хто хоче
            набути практики в ІТ сфері, взяти участь у створенні реальних проєктів для
            громадськості.
          </Typography>
        </div>
        <div className={styles.bazaWrapper}>
          <Typography component="p" variant="h5" className={styles.bazaCTA}>
            Дізнайтесь більше про нас
          </Typography>

          <div className={styles.socialWrapper}>
            <Link
              className={styles.socialLink}
              href="https://baza-trainee.tech/"
              target="_blank"
              rel="nofollow noreferrer noopener"
            >
              <Image
                src="/images/logo-baza.svg"
                width={40}
                height={40}
                alt="logo"
                className={styles.socialIcon}
              />
            </Link>

            <Link
              className={styles.socialLink}
              href="https://www.linkedin.com/company/baza-trainee-ukraine/"
              target="_blank"
              rel="nofollow noreferrer noopener"
            >
              <Linkedin className={styles.socialIcon} size="40" />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  </section>
);

export default AdditionalInfo;
