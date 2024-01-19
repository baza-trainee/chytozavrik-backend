import React from 'react';
import LightRays from '@/app/(wigwam)/wigwam/[childId]/awards/components/Images/LightRays';
import Cloud from '@/app/(wigwam)/wigwam/[childId]/awards/components/Images/Cloud';
import Book from '@/app/(wigwam)/wigwam/[childId]/awards/components/Images/Book';
import MonstersSlider from '@/app/(wigwam)/wigwam/[childId]/awards/components/MonsterDetails/MonstersSlider';
import { Monster } from '@/types/Monsters';
import { MoveLeft } from 'lucide-react';
import styles from './styles.module.scss';

const MonsterDetails = ({
  results,
  setShowMonster,
  monsterId,
}: {
  results: Monster[];
  monsterId: number | string | null;
  setShowMonster: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <section className={styles.wrapper}>
    <button className={styles.button} onClick={() => setShowMonster(false)}>
      <MoveLeft color="#FFFFFF" />
      До читозавриків
    </button>
    <LightRays className={styles.rays} />
    <Cloud className={styles.clouds} />
    <Book className={styles.book} />
    <MonstersSlider results={results} monsterId={monsterId} />
  </section>
);

export default MonsterDetails;
