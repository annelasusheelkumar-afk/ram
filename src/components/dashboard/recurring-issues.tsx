'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Inquiry } from '@/lib/types';
import { detectRecurringIssues } from '@/ai/flows/detect-recurring-issues';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';

type RecurringIssue = {
  theme: string;
  summary: string;
  count: number;
};

export default function RecurringIssues() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [issues, setIssues] = useState<RecurringIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch recent inquiries from Firestore
  const inquiriesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Analyze the last 50 inquiries for trends
    return query(
      collection(firestore, 'inquiries'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
  }, [firestore, user]);

  const { data: inquiries, isLoading: inquiriesLoading } =
    useCollection<Inquiry>(inquiriesQuery);

  // 2. Analyze inquiries when they are loaded
  useEffect(() => {
    if (!inquiriesLoading && inquiries) {
      const analyze = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const inquiryTitles = inquiries.map((i) => i.title);
          if (inquiryTitles.length > 0) {
            const result = await detectRecurringIssues({ inquiryTitles });
            // Show top 3 recurring issues
            setIssues(result.recurringIssues.slice(0, 3));
          } else {
            setIssues([]);
          }
        } catch (e) {
          console.error('Error detecting recurring issues:', e);
          setError('Could not analyze issues at this time.');
        } finally {
          setIsLoading(false);
        }
      };
      analyze();
    }
  }, [inquiries, inquiriesLoading]);

  if (isLoading || inquiriesLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Analysis Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (issues.length === 0) {
    return (
      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>No Recurring Issues Detected</AlertTitle>
        <AlertDescription>
          The AI has not found any significant recurring patterns in the recent inquiries.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue, index) => (
        <div key={index} className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-card-foreground">{issue.theme}</h4>
                <Badge variant="secondary">Count: {issue.count}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
                {issue.summary}
            </p>
        </div>
      ))}
    </div>
  );
}
