'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: 'Check your email',
        description:
          'If an account exists for that email, a password reset link has been sent.',
      });
    } catch (error: any) {
        // We still don't want to reveal if a user exists or not for security reasons.
        // So we show the success toast even on `auth/user-not-found` error.
        if (error.code === 'auth/user-not-found') {
            toast({
                title: 'Check your email',
                description: 'If an account exists for that email, a password reset link has been sent.',
            });
        } else {
            console.error('Password reset email error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to send reset email. Please try again later.',
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </CardContent>
        </form>
        <CardContent className="mt-4 text-center text-sm">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
