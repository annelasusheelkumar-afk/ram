'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Skeleton component to ensure it only renders on the client
const Skeleton = dynamic(() => import('@/components/ui/skeleton').then(mod => mod.Skeleton), { ssr: false });

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  // Since this component is client-rendered, we can safely use state and effects
  // without causing hydration errors.

  return (
    <div className="hidden md:flex flex-col gap-4 border-r p-2 bg-sidebar w-64">
      <div className="p-2">
        {/* The Skeleton component will only be rendered on the client side */}
        <Skeleton className="h-8 w-3/4" />
      </div>
       <div className="p-2">
        <Skeleton className="h-8 w-full" />
      </div>
       <div className="p-2">
        <Skeleton className="h-8 w-full" />
      </div>

      <button
        className="mt-auto p-2 bg-muted text-foreground rounded"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Collapse' : 'Expand'}
      </button>
    </div>
  );
}
