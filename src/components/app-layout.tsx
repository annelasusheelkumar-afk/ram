'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from './app-header';
import NotificationPermissionManager from './NotificationPermissionManager';
import { useUser } from '@/firebase';
import AppSidebar from './Sidebar';
import { Skeleton } from './ui/skeleton';
import { SidebarProvider } from './ui/sidebar';

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/loading'].includes(pathname);
  const isPublicPage = ['/chatbot', '/'].includes(pathname);


  React.useEffect(() => {
    // If auth is loading, we wait. 
    // If it's done and there's no user, and we are on a protected page, redirect to login.
    if (!isUserLoading && !user && !isAuthPage && !isPublicPage) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname, isAuthPage, isPublicPage]);

  // Render auth pages without the main app layout.
  if (isAuthPage) {
    return <main className="h-svh">{children}</main>;
  }
  
  // While checking for the user on a protected page, show a full-page loading skeleton.
  if (isUserLoading && !isPublicPage) {
    return (
      <div className="flex h-screen w-full bg-background">
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
  
  // If we're on a protected page, done loading, and there's no user, the useEffect will trigger a redirect.
  // We render null here to prevent a flash of the main layout.
  if (!user && !isPublicPage) {
    return null;
  }

  // Once the user is confirmed (or if it's a public page), render the full application layout.
  return (
    <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          {user && <NotificationPermissionManager />}
          <AppHeader />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
    </SidebarProvider>
  );
}

export default AppLayout;
