'use client';

import { useCollection, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Sale } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '../ui/skeleton';

function RecentSales() {
  const firestore = useFirestore();

  const salesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'sales'), orderBy('date', 'desc'), limit(5));
  }, [firestore]);

  const { data: sales, isLoading } = useCollection<Sale>(salesQuery);

  if (isLoading) {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[150px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-6 w-[50px] ml-auto" />
                </div>
            ))}
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {sales?.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            {/* In a real app, you'd fetch the user's avatar */}
            <AvatarFallback>{sale.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.product}</p>
            <p className="text-sm text-muted-foreground">User ID: {sale.userId.substring(0, 8)}...</p>
          </div>
          <div className="ml-auto font-medium">+${sale.amount.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}

export default RecentSales;
