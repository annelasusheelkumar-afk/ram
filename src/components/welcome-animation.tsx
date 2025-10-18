'use client';

import { useEffect, useState } from 'react';
import Logo from './logo';
import { cn } from '@/lib/utils';

const WelcomeAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-64">
      <style jsx>{`
        @keyframes slide-in {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes wave-arm {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .robot-container {
          animation: slide-in 1.5s ease-out forwards;
        }
        .robot-arm {
          transform-origin: 90% 10%;
          animation: wave-arm 1s ease-in-out 1.5s 2;
        }
        .speech-bubble {
          opacity: 0;
          animation: fade-in 0.5s ease-out 1s forwards;
        }
      `}</style>

      <div
        className={cn(
          'absolute bottom-0 transition-transform duration-1000',
          isAnimating ? 'robot-container' : 'translate-y-full opacity-0'
        )}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          {/* Head */}
          <rect x="30" y="10" width="40" height="30" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
          {/* Eye */}
          <circle cx="42" cy="25" r="3" fill="hsl(var(--primary))" />
          <circle cx="58" cy="25" r="3" fill="hsl(var(--primary))" />
           {/* Smile */}
          <path d="M 40 32 Q 50 38 60 32" stroke="hsl(var(--primary))" fill="none" strokeWidth="2" strokeLinecap="round" />
          {/* Antenna */}
          <line x1="50" y1="10" x2="50" y2="5" stroke="hsl(var(--muted-foreground))" strokeWidth="2" />
          <circle cx="50" cy="3" r="2" fill="hsl(var(--primary))" />
          {/* Body */}
          <rect x="20" y="40" width="60" height="40" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
          {/* Logo on body */}
          <g transform="translate(42, 50) scale(0.15)">
             <Logo />
          </g>

          {/* Left Arm */}
          <g>
            <rect x="10" y="45" width="10" height="25" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
          </g>
          
          {/* Right Arm (Waving) */}
          <g className="robot-arm">
             <rect x="80" y="45" width="10" height="25" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2"/>
          </g>

          {/* Wheels/Treads */}
          <rect x="25" y="80" width="50" height="10" rx="3" fill="hsl(var(--muted-foreground))" />
        </svg>
      </div>

      <div
        className={cn(
          'speech-bubble absolute -top-8 -right-20 bg-primary text-primary-foreground text-center p-3 rounded-lg shadow-lg transition-opacity duration-500 after:content-[\'\'] after:absolute after:left-1/2 after:bottom-[-10px] after:-translate-x-1/2 after:border-[10px] after:border-t-primary after:border-transparent',
          isAnimating ? 'speech-bubble' : 'opacity-0'
        )}
      >
        <p className="font-headline font-semibold">Welcome to ServAI!</p>
      </div>
    </div>
  );
};

export default WelcomeAnimation;
