'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useFirestore } from '@/firebase/provider';
import { doc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const withAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAdminAuthComponent = (props: P) => {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();

    const userProfileRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    useEffect(() => {
      if (!isUserLoading && !isProfileLoading) {
        if (!user || userProfile?.role !== 'admin') {
          router.replace('/dashboard'); // or a dedicated 'unauthorized' page
        }
      }
    }, [user, userProfile, isUserLoading, isProfileLoading, router]);

    if (isUserLoading || isProfileLoading || userProfile?.role !== 'admin') {
      return (
        <div className="p-8">
            <Skeleton className="h-10 w-1/4 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAdminAuthComponent.displayName = `WithAdminAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithAdminAuthComponent;
};

export default withAdminAuth;
