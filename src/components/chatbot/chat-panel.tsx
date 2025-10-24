'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateChatbotResponse } from '@/ai/flows/generate-chatbot-response';
import { speechToText } from '@/ai/flows/speech-to-text';
import { useUser } from '@/firebase';
import { Send, Mic, StopCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const BotAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-full w-full text-primary"
  >
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="4" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
    <path d="M9 18h6" />
  </svg>
);


export default function ChatPanel() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();


  useEffect(() => {
    // Set initial message on client-side to avoid hydration mismatch
    setMessages([
        {
          text: 'Welcome to the ServAI chatbot! How can I help you today?',
          isUser: false,
          timestamp: new Date(),
        },
    ]);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await generateChatbotResponse({ message: input });
      const botMessage: Message = { text: result.response, isUser: false, timestamp: new Date() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating chatbot response:', error);
      const errorMessage: Message = {
        text: 'Sorry, I had trouble getting a response. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioBuffer = Buffer.from(await audioBlob.arrayBuffer());

        setIsLoading(true);
        try {
          const { text } = await speechToText({ audio: audioBuffer });
          setInput(text);
        } catch (error) {
          console.error('Error in speech-to-text:', error);
          toast({
            variant: 'destructive',
            title: 'Speech Recognition Error',
            description: 'Could not understand audio. Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
        
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: 'destructive',
        title: 'Microphone Access Denied',
        description: 'Please enable microphone permissions in your browser settings.',
      });
    }
  };


  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-3',
                message.isUser ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              <Avatar className="h-9 w-9">
                {message.isUser ? (
                  user?.photoURL && <AvatarImage src={user.photoURL} alt="User" />
                ) : (
                  <BotAvatar />
                )}
                <AvatarFallback>
                  {message.isUser ? (user?.email?.[0].toUpperCase() || 'U') : 'S'}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  'max-w-xs rounded-lg p-3 text-sm',
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                <p>{message.text}</p>
                <p className="mt-1 text-xs text-muted-foreground/80">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
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
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or use the mic..."
            autoComplete="off"
            disabled={isLoading || isRecording}
          />
           <Button type="button" size="icon" onClick={handleMicClick} variant={isRecording ? 'destructive' : 'ghost'} disabled={isLoading}>
            {isRecording ? <StopCircle /> : <Mic />}
            <span className="sr-only">{isRecording ? 'Stop recording' : 'Start recording'}</span>
          </Button>
          <Button type="submit" size="icon" disabled={isLoading || !input.trim() || isRecording}>
            <Send />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
