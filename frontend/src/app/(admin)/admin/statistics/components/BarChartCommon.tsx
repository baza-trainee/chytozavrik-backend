'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ChartQuizzes } from '@/types';

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  const splitText = (text: string, maxLength: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = currentLine.length + word.length + 1;
      if (width < maxLength) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };
  const lines = splitText(payload.value, 12);
  return (
    <g transform={`translate(${10},${y - 25})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={-11}
          y={index * 12}
          dy={16}
          textAnchor="start"
          fill="#5E5E5E"
          style={{ fontSize: '12px' }}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

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
    height={data.length * 84}
    barGap={8}
    barSize={17}
    barCategoryGap={6}
    data={data}
    layout="vertical"
    margin={{
      top: 6,
      right: 20,
      left: 26,
      bottom: 5,
    }}
  >
    <CartesianGrid stroke="#AFAFAF" />
    <YAxis type="category" dataKey="quiz_title" tick={CustomTick} tickSize={0} />

    <XAxis
      type="number"
      xAxisId="one"
      stroke="#8884d8"
      orientation="top"
      tickSize={0}
      tickMargin={8}
    />
    <Bar xAxisId="one" dataKey="num_unique_children" fill="#132D96" />
    <XAxis
      type="number"
      xAxisId="two"
      stroke="#8884d8"
      orientation="bottom"
      tickSize={0}
      tickMargin={8}
    />
    <Bar xAxisId="two" dataKey="total_attempts" fill="#7791FA" />
    <Legend
      width={300}
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
