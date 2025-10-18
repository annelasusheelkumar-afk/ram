'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';

export type Inquiry = {
    id: string;
    userId: string;
    customerName?: string;
    status: 'open' | 'resolved';
    lastMessage?: string;
    createdAt: string;
    updatedAt: string;
};

export function useInquiries(userId?: string) {
    const firestore = useFirestore();

    const inquiriesQuery = useMemoFirebase(() => {
        if (!firestore || !userId) return null;
        return query(
            collection(firestore, 'inquiries'),
            where('userId', '==', userId),
            orderBy('updatedAt', 'desc')
        );
    }, [firestore, userId]);

    const { data: inquiries, isLoading, error } = useCollection<Inquiry>(inquiriesQuery);

    return { inquiries, isLoading, error };
}
