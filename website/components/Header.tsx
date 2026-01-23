'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function Header() {
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/menus/location/header`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error('Failed to fetch header menu:', error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="text-2xl font-bold text-blue-600">
            CMS Website
          </Link>
          <ul className="flex space-x-6">
            {menu?.items?.map((item: MenuItem) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
