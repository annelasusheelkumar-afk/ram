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
      // The auth object must be valid for this to work.
      // useAuth() ensures we have a valid, initialized auth instance.
      await sendPasswordResetEmail(auth, email);
      
      // Always show the success toast for security reasons.
      toast({
        title: 'Check your email',
        description: 'If an account exists for that email, a password reset link has been sent.',
      });

    } catch (error: any) {
        // We also show the success toast on error to prevent user enumeration.
        // This includes 'auth/user-not-found' and other potential errors.
        toast({
            title: 'Check your email',
            description: 'If an account exists for that email, a password reset link has been sent.',
        });
        // We can still log the actual error for debugging purposes.
        console.error('Password reset email error (suppressed from user):', error);
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
