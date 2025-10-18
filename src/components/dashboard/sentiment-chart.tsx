'use client';

import * as React from 'react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const chartData = [
  { sentiment: 'Positive', value: 450, color: 'hsl(var(--chart-2))' },
  { sentiment: 'Neutral', value: 300, color: 'hsl(var(--chart-4))' },
  { sentiment: 'Negative', value: 150, color: 'hsl(var(--destructive))' },
];

const chartConfig = {
  value: {
    label: 'Inquiries',
  },
  positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-2))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--chart-4))',
  },
  negative: {
    label: 'Negative',
    color: 'hsl(var(--destructive))',
  },
};

export default function SentimentChart() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="sentiment"
          innerRadius={60}
          strokeWidth={5}
        >
          {chartData.map((entry) => (
            <Cell key={entry.sentiment} fill={entry.color} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="sentiment" />}
          className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
