'use client';

import React, { useEffect, useState } from 'react';
import { Monster } from '@/types/Monsters';
import Image from 'next/image';
import ArrowPrev from '@/app/(wigwam)/wigwam/[childId]/awards/components/Images/ArrowPrev';
import ArrowNext from '@/app/(wigwam)/wigwam/[childId]/awards/components/Images/ArrowNext';
import styles from './styles.module.scss';

const MonstersSlider = ({
  results,
  monsterId,
}: {
  results: Monster[];
  monsterId: number | string | null;
}) => {
  const initialIndex = results.findIndex(monster => monster.id === monsterId);
  const [currentSlide, setCurrentSlide] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [sliderItems, setSliderItems] = useState(results);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (currentSlide === sliderItems.length - 1 && results.length > 1) {
      setSliderItems(prevItems => [...prevItems, ...results]);
    }
  }, [currentSlide, results]);

  const goToNext = () => {
    setCurrentSlide(prevSlide => prevSlide + 1);
  };
  const goToPrev = () => {
    setCurrentSlide(prevSlide => {
      if (prevSlide === 0) {
        return prevSlide;
      }
      return prevSlide - 1;
    });
  };

  const sliderStyle = {
    display: 'flex',
    width: `${results.length * 100}%`,
    transform: `translateX(-${currentSlide * (100 / results.length)}%)`,
    transition: 'transform 1s ease',
  };

  const slideStyle = {
    width: `${100 / results.length}%`,
    flexShrink: 0,
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (results.length <= 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (results.length <= 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (results.length <= 1) return;
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > minSwipeDistance;
    if (isSwipe) {
      if (distance < 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
  };

  return (
    <div
      className={styles.slider}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button
        style={
          sliderItems.length === 1 || currentSlide === 0
            ? { visibility: 'hidden' }
            : { visibility: 'visible' }
        }
        className={styles.prev}
        onClick={goToPrev}
        aria-label="Попередній"
      >
        <ArrowPrev />
      </button>
      <div className={styles.slidesContainer} style={{ overflow: 'hidden' }}>
        <div className={styles.slides} style={sliderStyle}>
          {sliderItems.map((result, index) => (
            <div className={styles.slide} style={slideStyle} key={index}>
              <div className={styles.image}>
                <Image
                  src={result.reward}
                  alt="Читозаврик"
                  width={100}
                  height={100}
                  style={{
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        style={sliderItems.length === 1 ? { visibility: 'hidden' } : { visibility: 'visible' }}
        className={styles.next}
        onClick={goToNext}
        aria-label="Наступний"
      >
        <ArrowNext />
      </button>
    </div>
  );
};

export default MonstersSlider;
