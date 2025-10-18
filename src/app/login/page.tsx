'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, signInAnonymously as firebaseSignInAnonymously } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login successful!' });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    try {
      await firebaseSignInAnonymously(auth);
      toast({ title: 'Signed in anonymously.' });
      router.push('/');
    } catch (error: any) {
       toast({
        variant: 'destructive',
        title: 'Anonymous sign-in failed',
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailSignIn}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign in with Email'}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleAnonymousSignIn} disabled={isLoading}>
              Sign in Anonymously
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
