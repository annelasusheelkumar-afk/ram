'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NewInquiryForm from './new-inquiry-form';
import { Inquiry } from '@/lib/types';

export default function InquiriesList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isNewInquiryOpen, setIsNewInquiryOpen] = useState(false);

  const inquiriesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'inquiries'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: inquiries, isLoading } = useCollection<Inquiry>(inquiriesQuery);

  if (isLoading || isUserLoading) {
    return <p>Loading inquiries...</p>;
  }

  const handleRowClick = (inquiryId: string) => {
    router.push(`/inquiries/${inquiryId}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline">Inquiries</CardTitle>
            <CardDescription>
              View and manage all your customer service inquiries.
            </CardDescription>
          </div>
          <Button onClick={() => setIsNewInquiryOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Inquiry
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries && inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry.id}
                    onClick={() => handleRowClick(inquiry.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{inquiry.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inquiry.status === 'resolved' || inquiry.status === 'closed'
                            ? 'outline'
                            : 'secondary'
                        }
                      >
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isNewInquiryOpen} onOpenChange={setIsNewInquiryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Inquiry</DialogTitle>
          </DialogHeader>
          <NewInquiryForm
            onSuccess={(inquiryId) => {
              setIsNewInquiryOpen(false);
              router.push(`/inquiries/${inquiryId}`);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
