'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPages, deletePage } from '@/lib/actions/pages';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiFile } from 'react-icons/fi';
import { format } from 'date-fns';

export default function PagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPages();
    // Get current user to check permissions
    if (typeof window !== 'undefined') {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await getPages();
      setPages(data);
    } catch (error) {
      console.error('Page fetch error:', error);
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    
    try {
      await deletePage(id);
      toast.success('Page deleted successfully');
      fetchPages();
    } catch (error) {
      console.error('Page delete error:', error);
      toast.error('Failed to delete page');
    }
  };

  const canModify = user?.role === 'admin' || user?.role === 'editor' || user?.is_superuser || user?.is_staff;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        {canModify && (
          <Link
            href="/cms/pages/new/edit"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Page</span>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sections
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  {canModify && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{page.title}</div>
                      {page.seoTitle && (
                        <div className="text-xs text-gray-500 mt-1">{page.seoTitle}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">
                        /page/{page.slug}/
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/cms/homepage?page=${page.id}`}
                        className="text-sm text-primary-600 hover:text-primary-900"
                      >
                        {/* Note: sections_count might need to be added to getPages select/include if needed, or we just rely on page.sections if included */}
                        {page.sections ? page.sections.length : 0} sections
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.isActive ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {page.updatedAt
                        ? format(new Date(page.updatedAt), 'MMM dd, yyyy')
                        : page.createdAt
                        ? format(new Date(page.createdAt), 'MMM dd, yyyy')
                        : '-'}
                    </td>
                    {canModify && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/cms/pages/${page.id}/edit`}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <FiFile className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-500">No pages found. Create your first page!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
