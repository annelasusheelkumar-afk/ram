import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const inquiries = [
  { id: 'INQ-001', customer: 'John Doe', topic: 'Billing Issue', status: 'Resolved', sentiment: 'Negative' },
  { id: 'INQ-002', customer: 'Jane Smith', topic: 'Product Question', status: 'Open', sentiment: 'Neutral' },
  { id: 'INQ-003', customer: 'Sam Wilson', topic: 'Shipping Delay', status: 'Resolved', sentiment: 'Negative' },
  { id: 'INQ-004', customer: 'Brie Larson', topic: 'Feature Request', status: 'Open', sentiment: 'Positive' },
  { id: 'INQ-005', customer: 'Chris Evans', topic: 'Account Access', status: 'Resolved', sentiment: 'Positive' },
  { id: 'INQ-006', customer: 'Peter Parker', topic: 'Password Reset', status: 'Resolved', sentiment: 'Neutral' },
];

export default function RecentInquiriesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Inquiry ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Topic</TableHead>
          <TableHead>Sentiment</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((inquiry) => (
          <TableRow key={inquiry.id}>
            <TableCell className="font-medium">{inquiry.id}</TableCell>
            <TableCell>{inquiry.customer}</TableCell>
            <TableCell>{inquiry.topic}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className={cn('h-2 w-2 rounded-full',
                  inquiry.sentiment === 'Positive' && 'bg-positive',
                  inquiry.sentiment === 'Negative' && 'bg-destructive',
                  inquiry.sentiment === 'Neutral' && 'bg-neutral'
                )} />
                <span>{inquiry.sentiment}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
                <Badge variant={inquiry.status === 'Resolved' ? 'outline' : 'secondary'}>{inquiry.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
