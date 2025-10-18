import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, MessageCircle, Smile, Clock } from 'lucide-react';
import SentimentChart from '@/components/dashboard/sentiment-chart';
import ResponseTimeChart from '@/components/dashboard/response-time-chart';
import RecentInquiriesTable from '@/components/dashboard/recent-inquiries-table';

const stats = [
  { title: 'Total Inquiries', value: '1,234', icon: MessageCircle, change: '+12.5%' },
  { title: 'Avg. Response Time', value: '32s', icon: Clock, change: '-5.2%' },
  { title: 'Satisfaction Score', value: '92%', icon: Smile, change: '+1.8%' },
  { title: 'Est. Cost Savings', value: '$4,567', icon: DollarSign, change: '+20.1%' },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Response Times</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponseTimeChart />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentChart />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
            <RecentInquiriesTable />
        </CardContent>
       </Card>
    </div>
  );
}
