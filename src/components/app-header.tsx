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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { signOut } from '@/app/auth/actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (isUserLoading) {
    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <SidebarTrigger className="sm:hidden" />
        </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
      <SidebarTrigger className="sm:hidden" />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
                <AvatarFallback>{user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user.isAnonymous ? 'Anonymous User' : user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
        </div>
      )}
    </header>
  );
}
