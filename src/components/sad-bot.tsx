
'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const SadBot = ({ onAnimationEnd }: { onAnimationEnd: () => void }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation on mount
    setIsAnimating(true);
    // Notify parent to remove this component after animation completes
    const timer = setTimeout(onAnimationEnd, 1500); // Animation duration
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className={cn('absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10 transition-opacity duration-300', isAnimating ? 'opacity-100' : 'opacity-0')}>
        <style jsx>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px) rotate(-5deg); }
                75% { transform: translateX(10px) rotate(5deg); }
            }
            @keyframes fade-out {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
            .sad-bot-container {
                animation: shake 0.5s ease-in-out, fade-out 0.5s ease-in 1s forwards;
            }
        `}</style>
      <div className="sad-bot-container relative">
        <svg
          width="150"
          height="150"
          viewBox="0 0 100 100"
          className="drop-shadow-lg"
        >
          {/* Head */}
          <rect x="30" y="10" width="40" height="30" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--destructive))" strokeWidth="2"/>
          {/* Sad Eye */}
          <g transform="translate(42 22)">
             <X size={16} stroke="hsl(var(--destructive))" />
          </g>
          {/* Body */}
          <rect x="20" y="40" width="60" height="40" rx="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
};

export default SadBot;
