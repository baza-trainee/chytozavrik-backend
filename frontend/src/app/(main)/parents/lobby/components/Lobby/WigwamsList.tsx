import React from 'react';
import { Typography } from 'components/common';
import Link from 'next/link';
import { Route } from '@/constants';
import { ChildType } from '@/types';
import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
} from '@/app/(main)/parents/lobby/components/Avatar';
import styles from '@/app/(main)/parents/lobby/components/Lobby/Lobby.module.scss';

type WigwamsListProps = {
  users: ChildType[];
};

const Avatars = [
  undefined,
  <Avatar1 key="avatar1" />,
  <Avatar2 key="avatar2" />,
  <Avatar3 key="avatar3" />,
  <Avatar4 key="avatar4" />,
  <Avatar5 key="avatar5" />,
  <Avatar6 key="avatar6" />,
];

const WigwamsList = ({ users }: WigwamsListProps) => (
  <>
    <Typography className={styles.title} component="h1" variant="h2">
      Привіт! <br /> Ми за тобою сумували
    </Typography>
    <ul className={styles.list}>
      {users &&
        users.map(({ id, name, avatar }) => (
          <li key={id} className={styles.item}>
            <Link className={styles.link} href={`${Route.WIGWAM}/${id}`} data-avatar>
              <div className={styles.thumb}>{Avatars.at(avatar)}</div>
              <Typography className={styles.name} component="p" variant="h2">
                {name}
              </Typography>
            </Link>
          </li>
        ))}
    </ul>
  </>
);

export default WigwamsList;
