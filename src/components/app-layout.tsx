'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LayoutDashboard, MessageCircle, List } from 'lucide-react';
import Logo from './logo';
import AppHeader from './app-header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="h-[calc(100vh-3.5rem)]">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
