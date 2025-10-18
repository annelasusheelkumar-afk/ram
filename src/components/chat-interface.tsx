'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { getAiResponse } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  sentiment?: string;
};

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" size="icon" aria-label="Send message" disabled={isPending}>
      {isPending ? <Sparkles className="animate-spin" /> : <Send />}
    </Button>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      role: 'assistant',
      content: "Hello! I'm ServAI, your virtual assistant. How can I help you today?",
    },
  ]);
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

  useEffect(scrollToBottom, [messages]);
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userMessage = formData.get('message') as string;

    if (!userMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: 'user', content: userMessage },
    ]);
    setError(undefined);
    formRef.current?.reset();

    startTransition(async () => {
      const result = await getAiResponse({ error: error }, formData);
      if (result.error) {
        setError(result.error);
      } else if (result.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: 'assistant',
            content: result.response,
            sentiment: result.sentiment,
          },
        ]);
      }
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4 md:p-6" ref={scrollAreaRef}>
        <div className="space-y-6 pr-4">
          {messages.map((message) => (
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
                        <span className="text-muted-foreground text-sm font-body">ServAI is thinking...</span>
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
            disabled={isPending}
          />
          <SubmitButton isPending={isPending} />
          <Button variant="accent" disabled={isPending}>
            <AlertTriangle className="mr-2 h-4 w-4"/> Escalate
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
