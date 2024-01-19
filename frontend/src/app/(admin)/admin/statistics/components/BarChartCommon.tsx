'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartQuizzes } from '@/types';

const CustomLegendContent = (props: any) => {
  const { payload } = props;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              backgroundColor: entry.color,
              marginRight: '4px',
            }}
          />
          <span style={{ fontSize: '12px', color: '#868686' }}>
            {entry.value === 'num_unique_children' ? 'Кількість дітей, що пройшли вікторину' : null}
            {entry.value === 'total_attempts' ? 'Загальна кількість проходження вікторини' : null}
          </span>
        </li>
      ))}
    </ul>
  );
};

const BarChartCommon = ({ data }: { data: ChartQuizzes[] }) => (
  <BarChart
    width={710}
    height={data.length * 64}
    barGap={0}
    barSize={16}
    barCategoryGap={16}
    data={data}
    layout="vertical"
    margin={{
      top: 6,
      right: 20,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid stroke="#AFAFAF" />
    <YAxis
      type="category"
      dataKey="quiz_title"
      style={{ fontSize: '12px', fill: '#5E5E5E' }}
      tickMargin={6}
      tickSize={0}
    />
    <XAxis
      type="number"
      xAxisId="one"
      stroke="#8884d8"
      orientation="top"
      tickSize={0}
      tickMargin={6}
    />
    <Bar xAxisId="one" dataKey="num_unique_children" fill="#132D96" />
    <XAxis
      type="number"
      xAxisId="two"
      stroke="#8884d8"
      orientation="bottom"
      tickSize={0}
      tickMargin={6}
    />
    <Bar xAxisId="two" dataKey="total_attempts" fill="#7791FA" />
    <Legend
      width={302}
      wrapperStyle={{
        top: '50%',
        left: 740,
        transform: 'translateY(-50%)',
      }}
      content={<CustomLegendContent />}
    />
  </BarChart>
);

export default BarChartCommon;
