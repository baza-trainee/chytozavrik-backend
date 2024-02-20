'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartChilds } from '@/types';

const LineChartCommon = ({ data }: { data: ChartChilds[] }) => (
  <LineChart
    width={1040}
    height={200}
    data={data}
    margin={{
      top: 10,
      right: 20,
      left: 20,
      bottom: 0,
    }}
  >
    <CartesianGrid stroke="#AFAFAF" />
    <XAxis
      dataKey="month"
      stroke="#AFAFAF"
      fontSize="12px"
      tickSize={0}
      tickMargin={16}
      style={{ fill: '#5E5E5E' }}
    />
    <YAxis
      fontSize="16px"
      stroke="#AFAFAF"
      tick={{ dx: -40 }}
      tickSize={0}
      style={{ fill: '#5E5E5E', textAlign: 'right' }}
    />
    <Tooltip />
    <Line type="linear" dataKey="count" stroke="#7791FA" dot={{ r: 6 }} activeDot={{ r: 8 }} />
  </LineChart>
);

export default LineChartCommon;
