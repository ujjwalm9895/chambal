'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CmsService } from '@/lib/services/cms-service';
import toast from 'react-hot-toast';
import { FiX, FiSave, FiLayout } from 'react-icons/fi';

export default function PageEditPage() {
  const router = useRouter();
  const params = useParams();
  const pageId = params.id === 'new' ? null : params.id;
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    is_active: true,
  });

  useEffect(() => {
    if (pageId) {
      fetchPage();
    }
  }, [pageId]);

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

  const fetchPage = async () => {
    try {
      setLoading(true);
      const page = await CmsService.pages.get(pageId);
      setFormData({
        title: page.title || '',
        slug: page.slug || '',
        seo_title: page.seo_title || '',
        seo_description: page.seo_description || '',
        is_active: page.is_active !== undefined ? page.is_active : true,
      });
    } catch (error) {
      toast.error('Failed to load page');
      router.push('/cms/pages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = { ...formData };

      // Clean up data for submission
      if (!data.slug || data.slug.trim() === '') {
        delete data.slug;
      } else {
        data.slug = data.slug.trim();
      }
      if (!data.seo_title || data.seo_title.trim() === '') {
        data.seo_title = null;
      } else {
        data.seo_title = data.seo_title.trim();
      }
      if (!data.seo_description || data.seo_description.trim() === '') {
        data.seo_description = null;
      } else {
        data.seo_description = data.seo_description.trim();
      }

      let savedPage;
      if (pageId) {
        savedPage = await CmsService.pages.update(pageId, data);
        toast.success('Page updated successfully');
        // Stay on edit page after update
      } else {
        savedPage = await CmsService.pages.create(data);
        toast.success('Page created successfully');
        // Redirect to edit page of newly created page so user can continue editing (add sections, etc.)
        if (savedPage && savedPage.id) {
          router.push(`/cms/pages/${savedPage.id}/edit`);
          return; // Exit early to prevent further navigation
        }
      }
    } catch (error) {
      console.error('Page save error:', error);
      let errorMessage = 'Failed to save page';
      if (error.response?.data) {
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
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {pageId ? 'Edit Page' : 'Create New Page'}
        </h1>
        <div className="flex items-center space-x-3">
          {pageId && (
            <Link
              href={`/cms/homepage?page=${pageId}`}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Manage Page Sections"
            >
              <FiLayout className="w-5 h-5" />
              <span>Manage Sections</span>
            </Link>
          )}
          <Link
            href="/cms/pages"
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <FiX className="w-5 h-5" />
            <span>Cancel</span>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({
                  ...formData,
                  title,
                  slug: !pageId ? slugify(title) : formData.slug,
                });
              }}
              placeholder="Page Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
              placeholder="Auto-generated from title"
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty to auto-generate from title. Used in URL: /page/[slug]/
            </p>
          </div>

          {/* SEO Settings */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  maxLength={70}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  placeholder="Meta title for SEO (max 70 characters)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.seo_title.length}/70 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  rows="3"
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  placeholder="Meta description for SEO (max 160 characters)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.seo_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/cms/pages"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <FiSave className="w-5 h-5" />
            <span>{saving ? 'Saving...' : pageId ? 'Update Page' : 'Create Page'}</span>
          </button>
          {pageId && (
            <Link
              href={`/cms/homepage?page=${pageId}`}
              className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FiLayout className="w-5 h-5" />
              <span>Manage Sections</span>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
