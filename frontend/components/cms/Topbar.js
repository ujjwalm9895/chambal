'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiExternalLink, FiChevronDown, FiLogOut, FiGlobe, FiMenu } from 'react-icons/fi';
import { CmsService } from '@/lib/services/cms-service';
import toast from 'react-hot-toast';

export default function Topbar({ user, onSidebarToggle }) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [language, setLanguage] = useState('en');

  // Fallback: Get user from localStorage if not provided
  const userData = user || (typeof window !== 'undefined' ? (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })() : null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserMenu(false);
      setShowLangMenu(false);
    };
    if (showUserMenu || showLangMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu, showLangMenu]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (userData?.username) {
      return userData.username.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleLogout = async () => {
    try {
      await CmsService.auth.logout();
      toast.success('Logged out successfully');
      router.push('/cms/login');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
        {/* Hamburger Menu Button */}
        <button
          onClick={onSidebarToggle}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiMenu className="w-6 h-6" />
        </button>
        
        <div className="flex-1" />

        <div className="flex items-center space-x-3 lg:space-x-4">
          {/* View Site Button */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <FiExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLangMenu(!showLangMenu);
              }}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
            >
              <FiGlobe className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'English' : 'Hindi'}</span>
              <span className="sm:hidden">{language.toUpperCase()}</span>
              <FiChevronDown className="w-4 h-4" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === 'en'
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage('hi');
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    language === 'hi'
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Hindi
                </button>
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
              className="flex items-center space-x-2 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold text-xs">
                  {getUserInitials()}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="hidden md:inline">{userData?.name || userData?.username || 'User'}</span>
              <FiChevronDown className="w-4 h-4 hidden sm:inline" />
            </button>

            {showUserMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                        {getUserInitials()}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userData?.name || userData?.username || 'User'}
                      </p>
                      {userData?.email && (
                        <p className="text-xs text-gray-500 truncate">{userData.email}</p>
                      )}
                      {userData?.role_display && (
                        <p className="text-xs text-gray-400 mt-0.5">{userData.role_display}</p>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
