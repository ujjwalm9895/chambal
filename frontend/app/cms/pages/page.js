'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CmsService } from '@/lib/services/cms-service';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX, FiFile } from 'react-icons/fi';
import { format } from 'date-fns';

export default function PagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    is_active: true,
  });

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

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await CmsService.pages.list();
      setPages(Array.isArray(response) ? response : (response.results || []));
    } catch (error) {
      console.error('Page fetch error:', error);
      let errorMessage = 'Failed to load pages';
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to view pages.';
      } else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        title: formData.title.trim(),
        seo_title: formData.seo_title.trim() || null,
        seo_description: formData.seo_description.trim() || null,
        is_active: formData.is_active,
      };
      
      // Only include slug if it's provided and not empty
      if (formData.slug && formData.slug.trim()) {
        submitData.slug = formData.slug.trim();
      }
      
      if (editingPage) {
        await CmsService.pages.update(editingPage.id, submitData);
        toast.success('Page updated successfully');
      } else {
        await CmsService.pages.create(submitData);
        toast.success('Page created successfully');
      }
      setShowForm(false);
      setEditingPage(null);
      resetForm();
      fetchPages();
    } catch (error) {
      console.error('Page save error:', error);
      let errorMessage = 'Failed to save page';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to perform this action. Only admins and editors can modify pages.';
      } else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = `Title: ${error.response.data.title[0]}`;
        } else if (error.response.data.slug) {
          errorMessage = `Slug: ${error.response.data.slug[0]}`;
        } else {
          const firstKey = Object.keys(error.response.data)[0];
          const firstError = error.response.data[firstKey];
          errorMessage = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      title: page.title || '',
      slug: page.slug || '',
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      is_active: page.is_active !== undefined ? page.is_active : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return;
    
    try {
      await CmsService.pages.delete(id);
      toast.success('Page deleted successfully');
      fetchPages();
    } catch (error) {
      console.error('Page delete error:', error);
      let errorMessage = 'Failed to delete page';
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete pages. Only admins and editors can delete.';
      } else if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPage(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      seo_title: '',
      seo_description: '',
      is_active: true,
    });
  };

  const canModify = user?.role === 'admin' || user?.role === 'editor' || user?.is_superuser || user?.is_staff;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
        {canModify && !showForm && (
          <Link
            href="/cms/pages/new/edit"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add Page</span>
          </Link>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingPage ? 'Edit Page' : 'Add New Page'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: !editingPage ? slugify(title) : formData.slug,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Page Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Auto-generated from title"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave empty to auto-generate from title. Used in URL: /page/[slug]/
              </p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    maxLength={70}
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Meta title for SEO (max 70 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.seo_title.length}/70 characters
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description
                  </label>
                  <textarea
                    rows="3"
                    maxLength={160}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Meta description for SEO (max 160 characters)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.seo_description.length}/160 characters
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {editingPage ? 'Update Page' : 'Create Page'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

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
                      {page.seo_title && (
                        <div className="text-xs text-gray-500 mt-1">{page.seo_title}</div>
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
                        {page.sections_count || 0} section{page.sections_count !== 1 ? 's' : ''}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {page.is_active ? (
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
                      {page.updated_at
                        ? format(new Date(page.updated_at), 'MMM dd, yyyy')
                        : page.created_at
                        ? format(new Date(page.created_at), 'MMM dd, yyyy')
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
