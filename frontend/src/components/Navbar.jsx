import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenus } from '@/lib/api';

export default function Navbar() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const data = await getMenus('navbar');
      setMenus(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  return (
    <nav className="navbar bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-600">
          Chambal Sandesh
        </Link>
        {!loading && (
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-gray-700 hover:text-red-600">Home</Link>
            </li>
            {menus.map((menu) => (
              <li key={menu.id}>
                {menu.url && menu.url.startsWith('http') ? (
                  <a href={menu.url} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-red-600">
                    {menu.title}
                  </a>
                ) : (
                  <Link to={menu.url || '#'} className="text-gray-700 hover:text-red-600">{menu.title}</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}