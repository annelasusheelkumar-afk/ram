'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Logo from './logo';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  AreaChart,
  LogOut,
} from 'lucide-react';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';

const NavItem = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = icon;

  return (
    <SidebarMenuItem>
      <Link href={href} passHref legacyBehavior>
        <SidebarMenuButton isActive={isActive} tooltip={label}>
          <Icon />
          <span>{label}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
};

export default function AppSidebar() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-7 h-7" />
          <span className="text-lg font-semibold font-headline">ServAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/inquiries" icon={MessageSquare} label="Inquiries" />
          <NavItem href="/chatbot" icon={Bot} label="Chatbot" />
          {userProfile?.role === 'admin' && (
             <NavItem href="/admin/sales" icon={AreaChart} label="Sales" />
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Placeholder for footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}
