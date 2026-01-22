'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/cms/Sidebar';
import Topbar from '@/components/cms/Topbar';
import { Toaster } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

export default function CMSLayout({ children }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Controls show/hide (mobile)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Controls collapsed/expanded (all screens)

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't show layout on login page
  if (pathname === '/cms/login') {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Auto-expand when toggling on mobile
    if (sidebarCollapsed && !sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        user={session?.user} 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onCollapseToggle={toggleSidebarCollapse}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <Topbar user={session?.user} onSidebarToggle={toggleSidebarCollapse} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
