'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import WelcomeAnimation from '@/components/welcome-animation';

export default function LoadingPage() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Show animation immediately on component mount
    setShowAnimation(true);

    const redirectTimer = setTimeout(() => {
      router.replace('/');
    }, 4000); // Total delay before redirect

    return () => {
        clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-background overflow-hidden">
        {showAnimation && <WelcomeAnimation />}
    </div>
  );
}
