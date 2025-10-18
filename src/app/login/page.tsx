'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      // Non-blocking call
      initiateAnonymousSignIn(auth);
      toast({ title: 'Signing in as guest...' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Anonymous sign-in failed',
        description: error.message,
      });
      setIsLoading(false);
    }
    // No need for a finally block to set isLoading to false, 
    // as the user is immediately navigated away.
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to ServAI</CardTitle>
          <CardDescription>
            Get started right away with a guest account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            onClick={handleAnonymousSignIn}
            disabled={isLoading}
          >
            {isLoading ? 'Redirecting...' : 'Continue as Guest'}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground">
            You can explore the app as a guest. Your session will be temporary.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
