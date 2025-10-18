'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/logo';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // After a short delay to show the animation, redirect to the homepage.
    // The auth state listener will handle showing the correct content there.
    const timer = setTimeout(() => {
      router.replace('/');
    }, 2000); // 2-second delay for the animation

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background">
      <div className="flex animate-pulse items-center gap-4">
        <Logo className="size-16" />
        <h1 className="text-4xl font-headline font-semibold text-primary">ServAI</h1>
      </div>
      <p className="mt-4 text-muted-foreground">Please wait while we prepare your experience...</p>
    </div>
  );
}
