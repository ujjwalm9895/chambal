'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, MenuItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export default function Footer() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${API_URL}/menus/location/footer`, {
          cache: 'no-store', // Ensure no caching for client-side fetch
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMenu(data);
        }
      } catch (error) {
        console.error('Failed to fetch footer menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu(); // Initial fetch

    const interval = setInterval(fetchMenu, 30 * 1000); // Refetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Sort menu items by order
  const sortedItems = menu?.items
    ? [...menu.items].sort((a, b) => a.order - b.order)
    : [];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm md:text-base">
              &copy; {currentYear} Chambal Sandesh. All rights reserved.
            </p>
          </div>
          {sortedItems.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-4 md:gap-6">
              {sortedItems.map((item: MenuItem) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    className="text-gray-400 hover:text-white transition text-sm md:text-base"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
