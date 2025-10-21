'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ArrowLeft, Share2, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateResponseToCustomerInquiry } from '@/ai/flows/generate-response-to-customer-inquiry';
import { resolveCustomerInquiry } from '@/ai/flows/resolve-customer-inquiry';
import type { Inquiry, Message } from '@/lib/types';
import { CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
  const { toast } = useToast();
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    // Ensure window.location is accessed only on the client side
    setAppUrl(window.location.href);
  }, []);

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      toast({
        title: '📋 Link Copied!',
        description: 'The inquiry link has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to Copy',
        description: 'Could not copy the link. Please copy it manually.',
      });
    }
  };


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
      // First, try to resolve the inquiry
      const resolutionResult = await resolveCustomerInquiry({
        inquiryTitle: inquiry?.title || '',
        inquiryMessage: input,
      });

      let botMessageText = '';

      if (resolutionResult.resolutionSteps.length > 0) {
        botMessageText = `I think I can help with that. Here are some steps that might resolve the issue:\n\n${resolutionResult.resolutionSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\n${resolutionResult.resolutionSummary}`;
        if (resolutionResult.isResolved) {
          await updateDoc(inquiryRef, { status: 'resolved' });
        }
      } else {
         // If no resolution steps, fall back to the general response
        const generalResult = await generateResponseToCustomerInquiry({
          customerInquiry: input,
          customerServiceContext: inquiry?.title,
        });
        botMessageText = generalResult.response;
      }
      
      const botMessage: Omit<Message, 'id' | 'timestamp'> = {
        message: botMessageText,
        userId: 'bot',
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
         <div className='flex items-center justify-between gap-2 sm:gap-4'>
            <div className='flex items-center gap-2 sm:gap-4'>
                <Button asChild variant="ghost" size="icon" className="h-8 w-8 sm:h-7 sm:w-7">
                    <Link href="/inquiries"><ArrowLeft/></Link>
                </Button>
                <div>
                    <CardTitle className="font-headline text-lg sm:text-2xl">{inquiry?.title}</CardTitle>
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
            <Button variant="ghost" size="icon" onClick={() => setShareDialogOpen(true)}>
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share Inquiry</span>
            </Button>
         </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3',
                message.userId !== 'bot' ? 'justify-end' : 'justify-start'
              )}
            >
              <div className={cn('flex items-start gap-3', message.userId !== 'bot' ? 'flex-row-reverse' : 'flex-row')}>
                <Avatar className="h-9 w-9">
                  {message.userId === 'bot' ? (
                    <BotAvatar />
                  ) : null}
                  <AvatarFallback>
                    {message.userId !== 'bot' ? (user?.email?.[0].toUpperCase() || 'U') : 'S'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'max-w-sm md:max-w-md rounded-lg p-3 text-sm whitespace-pre-wrap',
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
            </div>
          ))}
          {isBotReplying && (
            <div className="flex items-start gap-3 flex-row">
              <Avatar className="h-9 w-9">
                <BotAvatar />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
              <div className="max-w-xs rounded-lg p-3 text-sm bg-muted">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-2 sm:p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-2xl mx-auto">
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

       <Dialog open={isShareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Inquiry</DialogTitle>
            <DialogDescription>
              Anyone with this link can view this inquiry.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input id="link" value={appUrl} readOnly className="flex-1" />
            <Button type="button" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy Link</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
