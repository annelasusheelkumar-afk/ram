'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeCustomerMessageSentiment } from '@/ai/flows/analyze-customer-message-sentiment';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

interface NewInquiryFormProps {
  onSuccess: (inquiryId: string) => void;
}

export default function NewInquiryForm({ onSuccess }: NewInquiryFormProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to create an inquiry.',
      });
      return;
    }
    setIsSubmitting(true);

    try {
      // 1. Analyze sentiment of the initial message
      const sentimentResult = await analyzeCustomerMessageSentiment({
        message: values.message,
      });

      // 2. Create the inquiry document
      const inquiriesRef = collection(firestore, 'inquiries');
      const newInquiryRef = await addDocumentNonBlocking(inquiriesRef, {
        title: values.title,
        userId: user.uid,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. Create the initial message sub-document
      if (newInquiryRef) {
        const messagesRef = collection(newInquiryRef, 'messages');
        addDocumentNonBlocking(messagesRef, {
          message: values.message,
          userId: user.uid,
          sentiment: sentimentResult.sentiment.toLowerCase(),
          timestamp: serverTimestamp(),
        });
      }


      toast({
        title: 'Inquiry Created',
        description: 'Your new inquiry has been successfully created.',
      });
      onSuccess(newInquiryRef.id);
    } catch (error) {
      console.error('Error creating inquiry:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to create inquiry',
        description: 'An unexpected error occurred. Please try again.',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inquiry Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Problem with billing" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  className="resize-none"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
        </Button>
      </form>
    </Form>
  );
}
