'use client';

import { useInquiries } from '@/hooks/use-inquiries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createInquiry } from './actions';
import { formatDistanceToNow } from 'date-fns';

export default function InquiriesPage() {
  const { user } = useUser();
  const { inquiries, isLoading } = useInquiries(user?.uid);
  const router = useRouter();

  const handleCreateInquiry = async () => {
    if (!user) return;
    const newInquiryId = await createInquiry(user.uid);
    if (newInquiryId) {
      router.push(`/inquiries/${newInquiryId}`);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Inquiries</h2>
        <Button onClick={handleCreateInquiry}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Inquiry
        </Button>
      </div>
      {isLoading && <p>Loading inquiries...</p>}
      {!isLoading && inquiries && inquiries.length === 0 && (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>No Inquiries Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-4">Click the button to start a new conversation.</p>
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {inquiries?.map((inquiry) => (
          <Link href={`/inquiries/${inquiry.id}`} key={inquiry.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{inquiry.customerName || `Inquiry ${inquiry.id.substring(0, 4)}`}</span>
                  <Badge variant={inquiry.status === 'resolved' ? 'outline' : 'secondary'}>{inquiry.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate h-5">{inquiry.lastMessage}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{inquiry.customerName || 'Guest'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                            {inquiry.updatedAt ? formatDistanceToNow(new Date(inquiry.updatedAt), { addSuffix: true }) : 'N/A'}
                        </span>
                    </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Minimal Badge component to avoid circular dependencies
function Badge({ variant, children }: {variant: string, children: React.ReactNode}) {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
    const variants: {[key: string]: string} = {
        'outline': 'text-foreground',
        'secondary': 'border-transparent bg-secondary text-secondary-foreground'
    }
    return <div className={`${baseClasses} ${variants[variant]}`}>{children}</div>
}
