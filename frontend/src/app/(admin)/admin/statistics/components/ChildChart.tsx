import Typography from '@/components/common/Typography/Typography';
import React from 'react';
import { ChartChilds } from '@/types';
import LineChartCommon from './LineChartCommon';
import styles from '../Statistics.module.scss';

const ChildChart = ({ childs }: { childs: ChartChilds[] }) => (
  <>
    <Typography component="h5" variant="h5" className={styles.title}>
      Кількість зареєстрованих дітей
    </Typography>
    <LineChartCommon data={childs} />
  </>
);

export default ChildChart;
