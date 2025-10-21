'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MoreVertical, LayoutDashboard, MessageSquare, Bot, AreaChart } from 'lucide-react';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';


export default function AppHeader() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally, show a toast notification on error
    }
  };

  if (isUserLoading) {
    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <SidebarTrigger className="sm:hidden" />
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex items-center gap-2 sm:ml-auto">
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
                <MoreVertical />
                <span className="sr-only">Open navigation</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Navigation</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2" />Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Link href="/inquiries"><MessageSquare className="mr-2" />Inquiries</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/chatbot"><Bot className="mr-2" />Chatbot</Link>
            </DropdownMenuItem>
             {userProfile?.role === 'admin' && (
                <DropdownMenuItem asChild>
                    <Link href="/admin/sales"><AreaChart className="mr-2" />Sales</Link>
                </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                <AvatarFallback>{user.isAnonymous ? 'G' : user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.isAnonymous ? 'Guest User' : user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
            <Button asChild>
                <Link href="/login">Get Started</Link>
            </Button>
        </div>
      )}
      </div>
    </header>
  );
}
