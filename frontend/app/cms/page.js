'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CmsService } from '@/lib/services/cms-service';
import toast from 'react-hot-toast';
import {
  FiFileText,
  FiClock,
  FiEdit,
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, title, value, color, href, bgColor }) => {
  const content = (
    <div
      className={`${bgColor || 'bg-white'} rounded-lg shadow-md p-6 transition-all duration-200 ${
        href ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-5xl font-bold ${color || 'text-gray-900'} mb-2`}>{value}</p>
          <p className={`text-base font-medium ${color || 'text-gray-600'}`}>{title}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded ${bgColor ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
            <Icon className={`w-6 h-6 ${color || 'text-gray-600'} opacity-70`} />
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await CmsService.dashboard.getStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <StatCard
          icon={FiFileText}
          title="Posts"
          value={stats?.total_posts || 0}
          color="text-white"
          bgColor="bg-teal-600"
          href="/cms/posts"
        />
        <StatCard
          icon={FiClock}
          title="Pending Posts"
          value={stats?.pending_posts || 0}
          color="text-white"
          bgColor="bg-red-600"
          href="/cms/posts?status=pending"
        />
        <StatCard
          icon={FiEdit}
          title="Drafts"
          value={stats?.draft_posts || 0}
          color="text-white"
          bgColor="bg-purple-600"
          href="/cms/posts?status=draft"
        />
        <StatCard
          icon={FiClock}
          title="Scheduled Posts"
          value={stats?.scheduled_posts || 0}
          color="text-white"
          bgColor="bg-yellow-500"
          href="/cms/posts?status=scheduled"
        />
      </div>
    </div>
  );
}
