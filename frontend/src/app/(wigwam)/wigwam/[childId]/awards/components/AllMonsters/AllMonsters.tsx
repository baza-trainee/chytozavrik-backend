import React from 'react';
import { AllMonstersProps } from '@/types/Monsters';
import SliderMonsters from '@/app/(wigwam)/wigwam/[childId]/awards/components/AllMonsters/MonstersSlider/SliderMonsters';
import styles from './AllMonsters.module.scss';

const AllMonsters = ({ results, onMonsterClick, isLoading }: AllMonstersProps) => (
  <section className={styles.monsters}>
    <SliderMonsters isLoading={isLoading} results={results} onMonsterClick={onMonsterClick} />
    <div className={styles.bgWrapper}>
      <div className={styles.clouds} />
      <div className={styles.wigwam} />
    </div>
  </section>
);

export default AllMonsters;
