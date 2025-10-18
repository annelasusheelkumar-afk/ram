'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { getAiResponseAndSave } from '@/app/inquiries/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useMessages } from '@/hooks/use-messages';
import { useUser } from '@/firebase';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sentiment?: string;
  createdAt: any;
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" size="icon" aria-label="Send message" disabled={isPending}>
      {isPending ? <Sparkles className="animate-spin" /> : <Send />}
    </Button>
  );
}

export default function InquiryChatPage({ params }: { params: { inquiryId: string } }) {
  const { inquiryId } = params;
  const { user } = useUser();
  const { messages, isLoading: messagesLoading } = useMessages(inquiryId);
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // When real messages load, clear optimistic messages
    setOptimisticMessages([]);
  }, [messages]);

  useEffect(scrollToBottom, [messages, optimisticMessages, isPending]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userMessageContent = formData.get('message') as string;

    if (!userMessageContent.trim() || !user) return;

    const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}`,
        role: 'user',
        content: userMessageContent,
        createdAt: new Date(),
    };

    setOptimisticMessages(prev => [...prev, optimisticMessage]);
    
    setError(undefined);
    formRef.current?.reset();

    // Add inquiryId and userId to formData for the server action
    formData.append('inquiryId', inquiryId);
    formData.append('userId', user.uid);


    startTransition(async () => {
      const result = await getAiResponseAndSave({ error: error }, formData);
      if (result.error) {
        setError(result.error);
        setOptimisticMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      } 
      // Successful processing will be reflected by the real-time listener
      // so no need to add AI response optimistically
    });
  };

  const allMessages = [...(messages || []), ...optimisticMessages].sort(
    (a, b) => (a.createdAt?.toDate?.() || a.createdAt) - (b.createdAt?.toDate?.() || b.createdAt)
  );

  return (
    <div className="flex h-full flex-col">
       <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {messagesLoading && allMessages.length === 0 && (
            <div className="flex justify-center items-center h-full">
                <Sparkles className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {allMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3 animate-in fade-in-0 zoom-in-95',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="border-2 border-primary/50">
                  <AvatarFallback>
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <Card
                className={cn(
                  'max-w-xl rounded-2xl shadow-md',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                )}
              >
                <CardContent className="p-3">
                  <p className="font-body text-base leading-relaxed">{message.content}</p>
                </CardContent>
              </Card>
              {message.role === 'user' && (
                <Avatar className="border-2 border-accent/50">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-3 justify-start">
                <Avatar className="border-2 border-primary/50">
                    <AvatarFallback>
                        <Bot />
                    </AvatarFallback>
                </Avatar>
                <Card className="max-w-md rounded-2xl shadow-md bg-card">
                    <CardContent className="p-3 flex items-center gap-2">
                        <Sparkles className="animate-spin h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-body text-muted-foreground">ServAI is thinking...</span>
                    </CardContent>
                </Card>
             </div>
          )}
        </div>
      </div>
      <div className="border-t bg-background p-4 md:p-6">
        <form ref={formRef} onSubmit={handleFormSubmit} className="flex items-center gap-2">
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            disabled={isPending || messagesLoading}
          />
          <SubmitButton isPending={isPending} />
          <Button variant="outline" disabled={isPending}>
            <AlertTriangle className="mr-2 h-4 w-4"/> Escalate
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
