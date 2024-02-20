import Typography from '@/components/common/Typography/Typography';
import React from 'react';
import LineChartCommon from './LineChartCommon';
import styles from '../Statistics.module.scss';

type User = {
  year: number;
  month: string;
  count: number;
};
type UsersChartProps = {
  users: User[];
};

const UserChart = ({ users }: { users: User[] }) => (
  <>
    <Typography component="h5" variant="h5" className={styles.title}>
      Кількість зареєстрованих користувачів
    </Typography>
    <LineChartCommon data={users} />
  </>
);

export default UserChart;
