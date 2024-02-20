import Typography from '@/components/common/Typography/Typography';
import React from 'react';
import { ChartActiveChilds } from '@/types';
import LineChartCommon from './LineChartCommon';
import styles from '../Statistics.module.scss';

const ActiveChildChart = ({ activeChilds }: { activeChilds: ChartActiveChilds[] }) => (
  <>
    <Typography component="h5" variant="h5" className={styles.title}>
      Кількість активних дітей
    </Typography>
    <LineChartCommon data={activeChilds} />
  </>
);

export default ActiveChildChart;
