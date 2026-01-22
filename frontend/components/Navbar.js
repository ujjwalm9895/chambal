'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicMenus } from '@/lib/actions/public';

export default function Navbar() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const data = await getPublicMenus('navbar');
      setMenus(data?.results || data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link href="/" className="navbar-logo">
          Chambal Sandesh
        </Link>
        {!loading && (
          <ul className="navbar-menu">
            <li>
              <Link href="/">Home</Link>
            </li>
            {menus.map((menu) => (
              <li key={menu.id}>
                {menu.url && menu.url.startsWith('http') ? (
                  <a href={menu.url} target="_blank" rel="noopener noreferrer">
                    {menu.title}
                  </a>
                ) : (
                  <Link href={menu.url || '#'}>{menu.title}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
