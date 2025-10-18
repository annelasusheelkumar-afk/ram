'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { date: 'Jan', time: 35 },
  { date: 'Feb', time: 42 },
  { date: 'Mar', time: 38 },
  { date: 'Apr', time: 31 },
  { date: 'May', time: 28 },
  { date: 'Jun', time: 25 },
];

const chartConfig = {
  time: {
    label: 'Response Time (s)',
    color: 'hsl(var(--chart-1))',
  },
};

export default function ResponseTimeChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          unit="s"
        />
        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="time" fill="var(--color-time)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
