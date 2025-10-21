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
} from '@/components/ui/sidebar';
import Logo from './logo';
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  AreaChart,
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
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={label}
      >
        <Link href={href}>
            <Icon />
            <span>{label}</span>
        </Link>
      </SidebarMenuButton>
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
    // This Sidebar is now only used for the mobile sheet/drawer view.
    // The AppLayout has been updated to remove the persistent desktop sidebar.
    <Sidebar collapsible="offcanvas">
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
