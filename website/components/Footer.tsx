'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function Footer() {
  const [menu, setMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/menus/location/footer`);
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error('Failed to fetch footer menu:', error);
      }
    };

    fetchMenu();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400">&copy; 2024 CMS Website. All rights reserved.</p>
          </div>
          <ul className="flex space-x-6">
            {menu?.items?.map((item: MenuItem) => (
              <li key={item.id}>
                <Link
                  href={item.url}
                  className="text-gray-400 hover:text-white transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
