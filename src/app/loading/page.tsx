'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeAnimation from '@/components/welcome-animation';

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    // After the animation duration, redirect to the homepage.
    const timer = setTimeout(() => {
      router.replace('/');
    }, 4000); // 4-second delay for the animation

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background overflow-hidden">
      <WelcomeAnimation />
    </div>
  );
}
