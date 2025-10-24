import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, MessageCircle, Smile, Clock, List, Zap, ShieldCheck } from 'lucide-react';
import SentimentChart from '@/components/dashboard/sentiment-chart';
import ResponseTimeChart from '@/components/dashboard/response-time-chart';
import RecentInquiriesTable from '@/components/dashboard/recent-inquiries-table';
import RecurringIssues from '@/components/dashboard/recurring-issues';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Response Times</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponseTimeChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <SentimentChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Predictive Issue Detection
                </CardTitle>
                <CardDescription>
                    AI-powered analysis of recent inquiries to flag recurring user problems.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RecurringIssues />
            </CardContent>
        </Card>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">CRM Integration</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Ready to connect with enterprise systems like Salesforce and Zoho to sync customer data and streamline workflows.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                         <ShieldCheck className="h-5 w-5 text-positive" />
                         Data Privacy & Security
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Built on Firebase with end-to-end encryption and robust security rules. We are committed to GDPR and CCPA compliance, ensuring your data is always protected.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>

       <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle className="font-headline">Recent Inquiries</CardTitle>
                <CardDescription>A list of the most recent customer inquiries.</CardDescription>
            </div>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/inquiries">View All</Link>
            </Button>
        </CardHeader>
        <CardContent>
            <RecentInquiriesTable />
        </CardContent>
       </Card>
    </div>
  );
}
