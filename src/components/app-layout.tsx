'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from './app-header';
import NotificationPermissionManager from './NotificationPermissionManager';
import { useUser } from '@/firebase';
import AppSidebar from './Sidebar';
import { Skeleton } from './ui/skeleton';
import { SidebarProvider, SidebarInset } from './ui/sidebar';

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

  // For both public and protected pages, show the main layout structure immediately.
  // The content inside will be responsible for its own loading state.
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        {user && <NotificationPermissionManager />}
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          {isUserLoading && !isPublicPage ? (
            // Show a skeleton for the main content of protected pages while user is loading
             <div className="p-4 md:p-8">
                <Skeleton className="h-96 w-full" />
             </div>
          ) : (
             // Once loading is complete, or for public pages, render the children.
             // If !user and not public, the useEffect hook will redirect.
             (user || isPublicPage) ? children : null
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}

export default AppLayout;
