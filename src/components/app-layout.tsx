'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LayoutDashboard, MessageCircle, List, Share2, DollarSign } from 'lucide-react';
import Logo from './logo';
import AppHeader from './app-header';
import NotificationPermissionManager from './NotificationPermissionManager';
import { useToast } from '@/hooks/use-toast';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { userProfile, isProfileLoading } = useAuthDependentData();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    // If auth state is resolved, there's no user, and we are not on an auth page, redirect to login.
    if (
      !isUserLoading &&
      !user &&
      !['/login', '/signup', '/forgot-password'].includes(pathname)
    ) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname]);
  
  const handleShare = async () => {
    const shareData = {
      title: 'ServAI',
      text: 'Check out this AI-driven customer service solution!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        throw new Error('Web Share API not supported');
      }
    } catch (err: any) {
        // Fallback to clipboard if share fails or is not supported
        try {
            await navigator.clipboard.writeText(shareData.url);
            toast({
            title: 'Link Copied!',
            description: 'App URL has been copied to your clipboard.',
            });
        } catch (copyErr) {
            console.error('Failed to copy link:', copyErr);
            toast({
                variant: 'destructive',
                title: 'Failed to copy link',
            });
        }
    }
  };


  // Show skeleton loader while user is loading AND they are not on an auth page
  if (isUserLoading && !['/login', '/signup', '/forgot-password'].includes(pathname)) {
     return (
       <div className="flex h-screen w-full bg-background">
          <div className="hidden md:flex flex-col gap-4 border-r p-2 bg-sidebar w-64">
              <div className='p-2'><Skeleton className="h-8 w-3/4" /></div>
              <div className='p-2'><Skeleton className="h-8 w-full" /></div>
              <div className='p-2'><Skeleton className="h-8 w-full" /></div>
              <div className='p-2'><Skeleton className="h-8 w-full" /></div>
          </div>
          <div className="flex-1">
              <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-end border-b bg-background px-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
              </header>
              <main className="p-8">
                  <Skeleton className="h-96 w-full" />
              </main>
          </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2 justify-center group-data-[collapsible=icon]:justify-center">
            <Logo className="size-8 shrink-0" />
            <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">ServAI</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/dashboard')}
                tooltip="Dashboard"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/inquiries')}
                tooltip="Inquiries"
              >
                <Link href="/inquiries">
                  <List />
                  <span>Inquiries</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/chatbot')}
                tooltip="Chatbot"
              >
                <Link href="/chatbot">
                  <MessageCircle />
                  <span>Chatbot</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             {(isProfileLoading) ? (
                <div className='p-2'><Skeleton className="h-8 w-full" /></div>
             ) : userProfile?.role === 'admin' && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/admin')}
                  tooltip="Sales Analytics"
                >
                  <Link href="/admin/sales">
                    <DollarSign />
                    <span>Sales Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleShare} tooltip="Share App">
                        <Share2 />
                        <span>Share App</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <NotificationPermissionManager />
        <AppHeader />
        <main className="h-[calc(100vh-3.5rem)]">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function useAuthDependentData() {
    const { user } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    return { userProfile, isProfileLoading };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on an authentication page, just render the children directly.
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/loading'].includes(pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Otherwise, render the full application layout which handles its own loading and auth checks.
  return <AppContent>{children}</AppContent>;
}
