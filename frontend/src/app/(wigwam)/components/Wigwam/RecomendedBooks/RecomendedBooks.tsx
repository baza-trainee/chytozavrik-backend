'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Typography } from 'components/common';
import { RecBookType, BookType } from '@/types';
import Slider from 'react-slick';
import './slick.css';
import './slick-theme.css';
import ArrowLeft from './icons/ArrowLeft';
import ArrowRight from './icons/ArrowRight';
import wigwamTextData from '../wigwamTextData.json';
import styles from './RecomendedBooks.module.scss';

interface RecomendedBooksProps {
  booksData?: BookType[] | undefined;
  recBooksData: RecBookType[] | undefined;
}

const NextArrow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className={`${styles.arrow} ${styles.next}`} onClick={onClick}>
    <ArrowRight />
  </div>
);

const PrevArrow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className={`${styles.arrow} ${styles.prev}`} onClick={onClick}>
    <ArrowLeft />
  </div>
);

const RecomendedBooks: React.FC<RecomendedBooksProps> = ({ booksData = [], recBooksData = [] }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const handleCardClick = (id: number) => {
    const quiz = booksData.find(quiz => quiz.book?.id === id);

    if (quiz) {
      const quizId = quiz.id;
      router.push(`${pathname}/${quizId}`);
    } else {
      router.push(`${pathname}/${id}`);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    cssEase: 'linear',
    nextArrow: <NextArrow onClick={() => {}} />,
    prevArrow: <PrevArrow onClick={() => {}} />,
    beforeChange: (current: number, next: number) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        },
      },
    ],
  };
  return (
    <section className={styles.slider}>
      <Typography component="h2" variant="h2" className={styles.rec_title}>
        {wigwamTextData[5]}
      </Typography>
      <div className={styles.slider_container}>
        <Slider {...settings}>
          {recBooksData?.map(({ title, cover_image: coverImage, id }, index) => (
            <div key={id} className={styles.card} onClick={() => handleCardClick(id)}>
              <div className={styles.card_image}>
                <Image src={coverImage} alt={title} width={128} height={158} />
              </div>
              {recBooksData[index].state.includes('Вікторина') && (
                <div className={styles.quiz_marker}>{wigwamTextData[6]}</div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RecomendedBooks;
