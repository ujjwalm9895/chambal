'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [topMenu, setTopMenu] = useState<Menu | null>(null);
  const [mainMenu, setMainMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState<string>('Chambal Sandesh');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [topRes, mainRes, settingsRes] = await Promise.all([
          fetch(`${API_URL}/menus/location/top-bar`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
          fetch(`${API_URL}/menus/location/header`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
          fetch(`${API_URL}/site-settings`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
        ]);

        if (topRes.ok) setTopMenu(await topRes.json());
        if (mainRes.ok) setMainMenu(await mainRes.json());
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          if (settings.brandName) {
            setBrandName(settings.brandName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch menus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
    const interval = setInterval(fetchMenus, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const sortedTopItems = topMenu?.items
    ? [...topMenu.items].sort((a, b) => a.order - b.order)
    : [];

  const sortedMainItems = mainMenu?.items
    ? [...mainMenu.items].sort((a, b) => a.order - b.order)
    : [];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar (Black/Dark) */}
      <div className="bg-black dark:bg-gray-900 text-white text-sm py-2 border-b border-gray-800">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Left: Top Menu Links */}
          <ul className="flex space-x-6">
            {sortedTopItems.length > 0 ? (
              sortedTopItems.map((item: MenuItem) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="hover:text-gray-300 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))
            ) : (
              // Default static links if no menu created yet
              <>
                <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
                <li><Link href="/about" className="hover:text-gray-300">About Us</Link></li>
              </>
            )}
          </ul>

          {/* Right: User/Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="hover:text-gray-300">Add Post</Link>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full overflow-hidden">
                {/* Placeholder Avatar */}
                <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span>ujjwal</span>
            </div>
            <button
              onClick={toggleTheme}
              className="hover:text-gray-300 transition p-1 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation (White/Dark) */}
      <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-black text-black dark:text-white">{brandName}</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8 font-bold text-sm uppercase tracking-wide">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition text-gray-700 dark:text-gray-300">HOME</Link>
              </li>
              {sortedMainItems.map((item: MenuItem) => (
                <li key={item.id} className="relative group">
                  <Link
                    href={item.url}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center text-gray-700 dark:text-gray-300"
                  >
                    {item.label}
                    {/* Arrow for dropdown indicator (visual only for now) */}
                    <span className="ml-1 text-xs">▼</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <ul className="flex flex-col">
              {sortedMainItems.map((item: MenuItem) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="block px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold uppercase text-sm text-gray-700 dark:text-gray-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
