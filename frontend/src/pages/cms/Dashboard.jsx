import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Welcome back, {user?.username}!</h3>
        <p className="text-gray-600">
          Select an option from the sidebar to manage your content.
        </p>
      </div>
    </div>
  );
}