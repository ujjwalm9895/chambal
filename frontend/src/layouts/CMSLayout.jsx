import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CMSLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/cms/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CMS Panel</h1>
        </div>
        <nav className="mt-6">
          <Link to="/cms" className="block px-6 py-2 text-gray-600 hover:bg-gray-100">Dashboard</Link>
          <Link to="/cms/posts" className="block px-6 py-2 text-gray-600 hover:bg-gray-100">Posts</Link>
          <button onClick={handleLogout} className="block w-full text-left px-6 py-2 text-red-600 hover:bg-gray-100">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}