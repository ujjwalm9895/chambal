'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPublicMenus } from '@/lib/actions/public';

export default function Footer() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const data = await getPublicMenus('footer');
      setMenus(data?.results || data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  // Group menus by link_type for better organization
  const groupedMenus = menus.reduce((acc, menu) => {
    if (!acc[menu.link_type]) {
      acc[menu.link_type] = [];
    }
    acc[menu.link_type].push(menu);
    return acc;
  }, {});

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {Object.entries(groupedMenus).map(([linkType, items]) => (
            <div key={linkType} className="footer-section">
              <h3>{linkType.charAt(0).toUpperCase() + linkType.slice(1)}</h3>
              <ul className="footer-links">
                {items.map((menu) => (
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
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Chambal Sandesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
