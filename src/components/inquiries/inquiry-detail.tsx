'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateResponseToCustomerInquiry } from '@/ai/flows/generate-response-to-customer-inquiry';
import type { Inquiry, Message } from '@/lib/types';
import { CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const BotAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-full w-full text-primary"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);

export default function InquiryDetail({ inquiryId }: { inquiryId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [input, setInput] = useState('');
  const [isBotReplying, setIsBotReplying] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showSparkles, setShowSparkles] = useState(false);

  const inquiryRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'inquiries', inquiryId) : null),
    [firestore, inquiryId]
  );
  const { data: inquiry, isLoading: isEnquiryLoading } = useDoc<Inquiry>(inquiryRef);

  const messagesQuery = useMemoFirebase(
    () =>
      inquiryRef
        ? query(collection(inquiryRef, 'messages'), orderBy('timestamp', 'asc'))
        : null,
    [inquiryRef]
  );
  const { data: messages } = useCollection<Message>(messagesQuery);
  
  const prevStatus = useRef<Inquiry['status']>();

  useEffect(() => {
    if (inquiry) {
      if (prevStatus.current !== 'resolved' && inquiry.status === 'resolved') {
        setShowSparkles(true);
        const timer = setTimeout(() => setShowSparkles(false), 2000); // Animation duration
        return () => clearTimeout(timer);
      }
      prevStatus.current = inquiry.status;
    }
  }, [inquiry]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isBotReplying]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user || !inquiryRef) return;

    const userMessage: Omit<Message, 'id' | 'timestamp'> = {
      message: input,
      userId: user.uid,
    };
    
    setInput('');
    addDocumentNonBlocking(collection(inquiryRef, 'messages'), {
      ...userMessage,
      timestamp: serverTimestamp(),
    });

    setIsBotReplying(true);

    try {
      const result = await generateResponseToCustomerInquiry({
        customerInquiry: input,
        customerServiceContext: inquiry?.title,
      });

      const botMessage: Omit<Message, 'id' | 'timestamp'> = {
        message: result.response,
        userId: 'bot',
        sentiment: result.sentiment.toLowerCase() as Message['sentiment'],
      };
      
      addDocumentNonBlocking(collection(inquiryRef, 'messages'), {
          ...botMessage,
          timestamp: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error generating bot response:', error);
      const errorMessage: Omit<Message, 'id'| 'timestamp'> = {
        message: 'Sorry, I had trouble getting a response. Please try again.',
        userId: 'bot',
      };
      addDocumentNonBlocking(collection(inquiryRef, 'messages'), {
        ...errorMessage,
        timestamp: serverTimestamp(),
    });
    } finally {
      setIsBotReplying(false);
    }
  };

  if (isEnquiryLoading) {
      return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col h-full">
      <CardHeader className="border-b">
         <div className='flex items-center gap-4'>
            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                <Link href="/inquiries"><ArrowLeft/></Link>
            </Button>
            <div>
                <CardTitle className="font-headline">{inquiry?.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1 relative">
                    <Badge
                        variant={
                        inquiry?.status === 'resolved' || inquiry?.status === 'closed'
                            ? 'outline'
                            : 'secondary'
                        }
                    >
                        {inquiry?.status}
                    </Badge>
                     {showSparkles && <div className="sparkle-container"><div className="sparkle" /></div>}
                </div>
            </div>
         </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.userId !== 'bot' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-9 w-9">
                {message.userId === 'bot' && <BotAvatar />}
                <AvatarFallback>
                  {message.userId !== 'bot' ? (user?.email?.[0].toUpperCase() || 'U') : 'R'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-md rounded-lg p-3 text-sm',
                  message.userId !== 'bot'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p>{message.message}</p>
                 {message.timestamp && <p className="mt-1 text-xs text-muted-foreground/80">
                  {new Date(message.timestamp.seconds * 1000).toLocaleTimeString()}
                </p>}
              </div>
            </div>
          ))}
          {isBotReplying && (
            <div className="flex items-start gap-3 flex-row">
              <Avatar className="h-9 w-9">
                <BotAvatar />
                <AvatarFallback>R</AvatarFallback>
              </Avatar>
              <div className="max-w-xs rounded-lg p-3 text-sm bg-muted">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            disabled={isBotReplying}
          />
          <Button type="submit" size="icon" disabled={isBotReplying || !input.trim()}>
            <Send />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
