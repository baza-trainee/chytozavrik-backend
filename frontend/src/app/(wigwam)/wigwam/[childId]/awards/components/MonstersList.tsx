'use client';

import React, { useState } from 'react';
import MonsterDetails from '@/app/(wigwam)/wigwam/[childId]/awards/components/MonsterDetails/MonsterDetails';
import AllMonsters from '@/app/(wigwam)/wigwam/[childId]/awards/components/AllMonsters/AllMonsters';
import { useFetchMonsters } from '@/hooks';

const MonstersList = ({ childId }: { childId: string }) => {
  const [showMonster, setShowMonster] = useState(false);
  const [selectedMonsterId, setSelectedMonsterId] = useState<number | string | null>(null);
  const { monsters, isLoading } = useFetchMonsters(childId);

  const showDetailsHandler = (id: number | string) => {
    setSelectedMonsterId(id);
    setShowMonster(true);
  };

  return !showMonster ? (
    <AllMonsters isLoading={isLoading} results={monsters} onMonsterClick={showDetailsHandler} />
  ) : (
    <MonsterDetails
      monsterId={selectedMonsterId}
      results={monsters}
      setShowMonster={setShowMonster}
    />
  );
};

export default MonstersList;
