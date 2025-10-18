'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import {
  initiateAnonymousSignIn,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Non-blocking call
      initiateEmailSignIn(auth, email, password);
      // Redirect to the loading page
      router.push('/loading');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleAnonymousSignIn = async () => {
    setIsGuestLoading(true);
    try {
      // Non-blocking call
      initiateAnonymousSignIn(auth);
      // Redirect to the loading page
      router.push('/loading');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Anonymous sign-in failed',
        description: error.message,
      });
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to ServAI</CardTitle>
          <CardDescription>
            Sign in to your account or continue as a guest.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailSignIn}>
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
                disabled={isLoading || isGuestLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGuestLoading}
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading || isGuestLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-4">
           <div className="relative w-full">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              OR
            </span>
          </div>
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleAnonymousSignIn}
            disabled={isLoading || isGuestLoading}
          >
            {isGuestLoading ? 'Redirecting...' : 'Continue as Guest'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
