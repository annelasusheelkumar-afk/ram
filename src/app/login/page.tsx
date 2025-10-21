
'use client';

import { useState, useEffect } from 'react';
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
import { useAuth, useUser } from '@/firebase';
import {
  initiateAnonymousSignIn,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { Separator } from '@/components/ui/separator';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
import SadBot from '@/components/sad-bot';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [showSadBot, setShowSadBot] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // If the user is successfully authenticated (and not loading), redirect them.
    if (!isUserLoading && user) {
      router.push('/loading');
    }
    // If auth state is resolved and there's no user, stop loading indicators.
    if (!isUserLoading && !user) {
        setIsLoading(false);
        setIsGuestLoading(false);
    }
  }, [user, isUserLoading, router]);

  const handleLoginFailure = () => {
    setShowSadBot(true);
    toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
    });
    setIsLoading(false);
  };


  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Set persistence to 'session' to require login on each new session.
    await setPersistence(auth, browserSessionPersistence);
    initiateEmailSignIn(auth, email, password, handleLoginFailure);
  };

  const handleAnonymousSignIn = async () => {
    setIsGuestLoading(true);
    // Also set persistence for anonymous users if desired.
    await setPersistence(auth, browserSessionPersistence);
    initiateAnonymousSignIn(auth);
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
      <Card className="relative overflow-hidden">
        {showSadBot && <SadBot onAnimationEnd={() => setShowSadBot(false)} />}
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
               <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>
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
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
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
    </div>
  );
}
