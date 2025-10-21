'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy } from 'lucide-react';
import React from 'react';
import { Input } from './ui/input';


export default function AppHeader() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isShareDialogOpen, setShareDialogOpen] = React.useState(false);
  const [appUrl, setAppUrl] = React.useState('');

  React.useEffect(() => {
    // Ensure window.location is accessed only on the client side
    setAppUrl(window.location.origin);
  }, []);


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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      toast({
        title: '📋 Link Copied!',
        description: 'The app link has been copied to your clipboard.',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: '❌ Failed to Copy',
        description: 'Could not copy the link. Please copy it manually.',
      });
    }
  };

  if (isUserLoading) {
    return (
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <SidebarTrigger />
        </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
        <SidebarTrigger />
        <div className="flex items-center gap-2 sm:ml-auto">
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
                <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share App
                </DropdownMenuItem>
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

      <Dialog open={isShareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share App</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to access the app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input id="link" value={appUrl} readOnly className="flex-1" />
            <Button type="button" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy Link</span>
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
