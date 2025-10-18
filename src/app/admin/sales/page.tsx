'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, CreditCard, ShoppingBag, Users } from 'lucide-react';
import SalesChart from '@/components/admin/sales-chart';
import RecentSales from '@/components/admin/recent-sales';
import withAdminAuth from '@/components/auth/with-admin-auth';

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    icon: DollarSign,
    change: '+20.1% from last month',
  },
  {
    title: 'Total Sales',
    value: '+2350',
    icon: CreditCard,
    change: '+180.1% from last month',
  },
  {
    title: 'New Customers',
    value: '+573',
    icon: Users,
    change: '+19% from last month',
  },
  {
    title: 'Top Product',
    value: 'Premium Support',
    icon: ShoppingBag,
    change: '250 units sold',
  },
];

function SalesPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Sales Analytics
        </h2>
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Sales Overview</CardTitle>
            <CardDescription>
              A chart showing total sales revenue over the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Sales</CardTitle>
            <CardDescription>
              A list of the most recent transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAdminAuth(SalesPage);
