'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeAnimation from '@/components/welcome-animation';

export default function LoadingPage() {
  const router = useRouter();
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Show sparkles immediately on component mount
    setShowSparkles(true);

    // After the animation duration, redirect to the homepage.
    const animationTimer = setTimeout(() => {
      setShowSparkles(false);
    }, 2000); // Sparkle animation duration

    const redirectTimer = setTimeout(() => {
      router.replace('/');
    }, 4000); // Total delay before redirect

    return () => {
        clearTimeout(animationTimer);
        clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-background overflow-hidden">
      <WelcomeAnimation />
      {showSparkles && (
        <div className="sparkle-container">
          <div className="sparkle" />
        </div>
      )}
    </div>
  );
}
