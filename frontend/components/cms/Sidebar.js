'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiPlusCircle,
  FiFileText,
  FiUpload,
  FiLayers,
  FiMenu,
  FiFile,
  FiLayout,
  FiUsers,
  FiSettings,
  FiChevronLeft,
} from 'react-icons/fi';

const menuItems = [
  { href: '/cms', icon: FiHome, label: 'Home' },
  { href: '/cms/posts/new', icon: FiPlusCircle, label: 'Add Post' },
  { href: '/cms/posts/upload', icon: FiUpload, label: 'Bulk Post Upload' },
  {
    href: '/cms/posts',
    icon: FiFileText,
    label: 'Posts',
    children: [
      { href: '/cms/posts', label: 'All Posts' },
      { href: '/cms/posts?slider=true', label: 'Slider Posts' },
      { href: '/cms/posts?featured=true', label: 'Featured Posts' },
      { href: '/cms/posts?breaking=true', label: 'Breaking News' },
      { href: '/cms/posts?recommended=true', label: 'Recommended Posts' },
      { href: '/cms/posts?status=pending', label: 'Pending Posts' },
      { href: '/cms/posts?status=scheduled', label: 'Scheduled Posts' },
      { href: '/cms/posts?status=draft', label: 'Drafts' },
    ],
  },
  { href: '/cms/categories', icon: FiLayers, label: 'Categories' },
  { href: '/cms/menus', icon: FiMenu, label: 'Menus' },
  { href: '/cms/pages', icon: FiFile, label: 'Pages' },
  { href: '/cms/homepage', icon: FiLayout, label: 'Homepage Builder' },
  { href: '/cms/users', icon: FiUsers, label: 'Users' },
  { href: '/cms/settings', icon: FiSettings, label: 'Settings' },
];

export default function Sidebar({ user, onToggle, onCollapseToggle, isOpen, isCollapsed }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState([]); // Don't auto-expand submenus when collapsed

  // Get user from localStorage if not provided
  const userData = user || (typeof window !== 'undefined' ? (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })() : null);

  const isActive = (href) => {
    if (href === '/cms') {
      return pathname === '/cms';
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = (href) => {
    if (expandedMenus.includes(href)) {
      setExpandedMenus(expandedMenus.filter(item => item !== href));
    } else {
      setExpandedMenus([...expandedMenus, href]);
    }
  };

  const handleCollapseToggle = () => {
    if (onCollapseToggle) {
      onCollapseToggle();
    }
    // Clear expanded menus when collapsing
    if (!isCollapsed) {
      setExpandedMenus([]);
    }
  };

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

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-700 text-white flex flex-col z-40 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-600 flex items-center justify-center">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-white flex-1">Chambal Sandesh</h1>
          )}
          <button
            onClick={handleCollapseToggle}
            className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-600 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Section - Only show when expanded */}
        {userData && !isCollapsed && (
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold">
                  {getUserInitials()}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userData.name || userData.username || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-xs text-green-400">online</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {!isCollapsed && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                MAIN NAVIGATION
              </p>
            </div>
          )}
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.includes(item.href) && !isCollapsed;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  {hasChildren && !isCollapsed ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.href)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                          active
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <FiChevronLeft
                          className={`w-4 h-4 transition-transform ${isExpanded ? '-rotate-90' : ''}`}
                        />
                      </button>
                      {isExpanded && (
                        <ul className="mt-1 ml-8 space-y-1">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                  pathname === child.href
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-600 hover:text-gray-200'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg transition-colors ${
                        active
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : ''}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
