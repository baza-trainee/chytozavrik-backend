'use client';

import React from 'react';
import classNames from 'classnames';
import { Container } from 'components/common';
import { useSession } from 'next-auth/react';
import { useQueryPartners } from '@/hooks/Partners/useQueryPartners';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Partner } from '@/types/admin/PartnersType';
import Link from 'next/link';
import styles from './Partners.module.scss';
import 'swiper/css';
import 'swiper/css/autoplay';

const Partners = () => {
  const session = useSession();
  const { partners } = useQueryPartners({});

  return (
    <section
      className={classNames({
        [styles.section]: true,
        [styles['section--margin-top']]: session.status === 'authenticated',
      })}
    >
      <Container className={styles.container}>
        <Swiper
          className={styles.swiperContainer}
          loop
          modules={[Autoplay]}
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          speed={600}
          centeredSlides
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          zoom={{
            maxRatio: 2,
            minRatio: 1,
          }}
        >
          {partners?.results.map((partner: Partner) => (
            <SwiperSlide key={partner.id}>
              <Link href={partner.link} className={styles.item}>
                <img src={partner.img} alt={partner.name} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};
export default Partners;
