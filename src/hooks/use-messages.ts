'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sentiment?: string;
    createdAt: any; // Firestore Timestamp
};

export function useMessages(inquiryId: string) {
    const firestore = useFirestore();

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !inquiryId) return null;
        return query(
            collection(firestore, 'inquiries', inquiryId, 'messages'),
            orderBy('createdAt', 'asc')
        );
    }, [firestore, inquiryId]);

    const { data: messages, isLoading, error } = useCollection<Message>(messagesQuery);

    return { messages, isLoading, error };
}
