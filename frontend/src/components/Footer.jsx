import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenus } from '@/lib/api';

export default function Footer() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const data = await getMenus('footer');
      setMenus(data.results || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Chambal Sandesh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}