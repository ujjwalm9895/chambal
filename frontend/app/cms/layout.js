'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/cms/Sidebar';
import Topbar from '@/components/cms/Topbar';
import { CmsService } from '@/lib/services/cms-service';
import { Toaster } from 'react-hot-toast';

export default function CMSLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Controls show/hide (mobile)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Controls collapsed/expanded (all screens)

  useEffect(() => {
    checkAuth();
  }, []);

  // Also listen for pathname changes to refresh user data
  useEffect(() => {
    if (pathname !== '/cms/login' && !user) {
      checkAuth();
    }
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        if (pathname !== '/cms/login') {
          router.push('/cms/login');
        }
        setLoading(false);
        return;
      }

      // Try to get user from API
      try {
        const userData = await CmsService.auth.me();
        setUser(userData);
        // Also update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (apiError) {
        // If API call fails, try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      // If everything fails, try localStorage as last resort
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (parseError) {
          console.error('Error parsing stored user:', parseError);
        }
      }
      
      if (pathname !== '/cms/login') {
        // Only redirect if we really don't have a user
        if (!storedUser) {
          router.push('/cms/login');
        }
      }
      setLoading(false);
    }
  };

  if (loading) {
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
        user={user} 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        onCollapseToggle={toggleSidebarCollapse}
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <Topbar user={user} onSidebarToggle={toggleSidebarCollapse} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
