'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from './app-header';
import NotificationPermissionManager from './NotificationPermissionManager';
import { useUser } from '@/firebase';
import Sidebar from './Sidebar';
import { Skeleton } from './ui/skeleton';
import { SidebarProvider } from './ui/sidebar';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full bg-background">
        <div className="hidden md:flex flex-col gap-4 border-r p-2 bg-sidebar w-64">
          <div className="p-2"><Skeleton className="h-8 w-3/4" /></div>
          <div className="p-2"><Skeleton className="h-8 w-full" /></div>
          <div className="p-2"><Skeleton className="h-8 w-full" /></div>
          <div className="p-2"><Skeleton className="h-8 w-full" /></div>
        </div>
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-end border-b bg-background px-4">
            <Skeleton className="h-9 w-9 rounded-full" />
          </header>
          <main className="flex-1 p-8">
            <Skeleton className="h-96 w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-full min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <NotificationPermissionManager />
          <AppHeader />
          <main className="h-[calc(100vh-3.5rem)] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/loading'].includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppContent>{children}</AppContent>;
}
