'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { postApi, categoryApi } from '@/lib/cms-api';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { FiPlus, FiX } from 'react-icons/fi';

// Dynamically import TipTap editor
const TipTapEditor = dynamic(() => import('@/components/cms/TipTapEditor'), { ssr: false });

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params.id === 'new' ? null : params.id;
  const postFormat = searchParams.get('format') || 'article';
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    language: 'en',
    show_in_menu: true,
    menu_order: 0,
    is_active: true,
  });
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
    language: 'en',
    status: 'draft',
    is_featured: false,
    is_slider: false,
    is_breaking: false,
    is_recommended: false,
    publish_at: '',
    seo_title: '',
    seo_description: '',
    featured_image: null,
    video: null,
    video_url: '',
  });
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.list();
      setCategories(Array.isArray(response) ? response : (response.results || []));
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      // Prepare category data - remove empty slug to let backend generate it
      const categoryData = {
        name: newCategory.name.trim(),
        language: newCategory.language,
        show_in_menu: newCategory.show_in_menu,
        menu_order: newCategory.menu_order || 0,
        is_active: newCategory.is_active,
      };
      
      // Only include slug if it's provided and not empty
      if (newCategory.slug && newCategory.slug.trim()) {
        categoryData.slug = newCategory.slug.trim();
      }
      
      const created = await categoryApi.create(categoryData);
      toast.success('Category created successfully');
      setShowCategoryForm(false);
      setNewCategory({
        name: '',
        slug: '',
        language: formData.language, // Use the same language as the post
        show_in_menu: true,
        menu_order: 0,
        is_active: true,
      });
      // Refresh categories list
      await fetchCategories();
      // Auto-select the newly created category
      setFormData({ ...formData, category: created.id });
    } catch (error) {
      console.error('Category creation error:', error);
      // Extract error message from response
      let errorMessage = 'Failed to create category';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.slug) {
          errorMessage = `Slug error: ${Array.isArray(error.response.data.slug) ? error.response.data.slug[0] : error.response.data.slug}`;
        } else if (error.response.data.name) {
          errorMessage = `Name error: ${Array.isArray(error.response.data.name) ? error.response.data.name[0] : error.response.data.name}`;
        } else {
          // Try to get first error message
          const firstKey = Object.keys(error.response.data)[0];
          const firstError = error.response.data[firstKey];
          errorMessage = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
        }
      }
      toast.error(errorMessage);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await postApi.get(postId);
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category?.id || '',
        language: post.language || 'en',
        status: post.status || 'draft',
        is_featured: post.is_featured || false,
        is_slider: post.is_slider || false,
        is_breaking: post.is_breaking || false,
        is_recommended: post.is_recommended || false,
        publish_at: post.publish_at ? new Date(post.publish_at).toISOString().slice(0, 16) : '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        featured_image: null,
        video: null,
        video_url: post.video_url || '',
      });
      // Set previews for existing images/videos
      if (post.featured_image_url) {
        setFeaturedImagePreview(post.featured_image_url);
      }
      if (post.video_url_display) {
        setVideoPreview(post.video_url_display);
      } else if (post.video_url) {
        setVideoPreview(post.video_url);
      }
    } catch (error) {
      toast.error('Failed to load post');
      router.push('/cms/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Check if we have files to upload
      const hasFiles = formData.featured_image instanceof File || formData.video instanceof File;
      
      let data;
      let config = {};
      
      if (hasFiles) {
        // Use FormData for file uploads
        data = new FormData();
        
        // Append text fields
        if (formData.title) data.append('title', formData.title.trim());
        if (formData.slug && formData.slug.trim()) data.append('slug', formData.slug.trim());
        if (formData.content) data.append('content', formData.content);
        if (formData.excerpt && formData.excerpt.trim()) data.append('excerpt', formData.excerpt.trim());
        if (formData.category) data.append('category', parseInt(formData.category));
        if (formData.language) data.append('language', formData.language);
        if (formData.status) data.append('status', formData.status);
        if (formData.is_featured) data.append('is_featured', formData.is_featured);
        if (formData.is_slider) data.append('is_slider', formData.is_slider);
        if (formData.is_breaking) data.append('is_breaking', formData.is_breaking);
        if (formData.is_recommended) data.append('is_recommended', formData.is_recommended);
        if (formData.publish_at && formData.publish_at.trim()) data.append('publish_at', formData.publish_at);
        if (formData.seo_title && formData.seo_title.trim()) data.append('seo_title', formData.seo_title.trim());
        if (formData.seo_description && formData.seo_description.trim()) data.append('seo_description', formData.seo_description.trim());
        if (formData.video_url && formData.video_url.trim()) data.append('video_url', formData.video_url.trim());
        
        // Append files
        if (formData.featured_image instanceof File) {
          data.append('featured_image', formData.featured_image);
        }
        if (formData.video instanceof File) {
          data.append('video', formData.video);
        }
        
        config.headers = { 'Content-Type': 'multipart/form-data' };
      } else {
        // Use regular JSON for non-file uploads
        data = { ...formData };
        
        // Clean up the data
        if (!data.category || data.category === '') {
          delete data.category;
        } else {
          data.category = parseInt(data.category);
        }
        
        if (!data.slug || data.slug.trim() === '') {
          delete data.slug;
        }
        
        if (!data.video_url || data.video_url.trim() === '') {
          delete data.video_url;
        }
        
        if (!data.publish_at || data.publish_at.trim() === '') {
          delete data.publish_at;
        }
        
        // Don't send file objects in JSON
        delete data.featured_image;
        delete data.video;
      }

      if (postId) {
        await postApi.update(postId, data, config);
        toast.success('Post updated successfully');
      } else {
        await postApi.create(data, config);
        toast.success('Post created successfully');
      }
      router.push('/cms/posts');
    } catch (error) {
      console.error('Post save error:', error);
      let errorMessage = 'Failed to save post';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.title) {
          errorMessage = `Title error: ${Array.isArray(error.response.data.title) ? error.response.data.title[0] : error.response.data.title}`;
        } else if (error.response.data.content) {
          errorMessage = `Content error: ${Array.isArray(error.response.data.content) ? error.response.data.content[0] : error.response.data.content}`;
        } else if (error.response.data.category) {
          errorMessage = `Category error: ${Array.isArray(error.response.data.category) ? error.response.data.category[0] : error.response.data.category}`;
        } else {
          // Try to get first error message
          const firstKey = Object.keys(error.response.data)[0];
          const firstError = error.response.data[firstKey];
          errorMessage = `${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {postId ? 'Edit Post' : 'Create New Post'}
      </h1>

      {/* Quick Category Creation Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create New Category</h2>
              <button
                type="button"
                onClick={() => setShowCategoryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setNewCategory({
                      ...newCategory,
                      name,
                      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="category-slug"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language *
                </label>
                <select
                  required
                  value={newCategory.language}
                  onChange={(e) => setNewCategory({ ...newCategory, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCategory.show_in_menu}
                    onChange={(e) => setNewCategory({ ...newCategory, show_in_menu: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Show in Menu</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newCategory.is_active}
                    onChange={(e) => setNewCategory({ ...newCategory, is_active: e.target.checked })}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setNewCategory({ ...newCategory, language: formData.language });
                    setShowCategoryForm(true);
                  }}
                  className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>New Category</span>
                </button>
              </div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories
                  .filter(cat => cat.is_active)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.language_display || cat.language.toUpperCase()})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <TipTapEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief description..."
            />
          </div>

          {/* Media Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                {featuredImagePreview && (
                  <div className="mb-3">
                    <img
                      src={featuredImagePreview}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFeaturedImagePreview(null);
                        setFormData({ ...formData, featured_image: null });
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, featured_image: file });
                      setFeaturedImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload a featured image for this post
                </p>
              </div>

              {/* Video */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video (Upload File)
                </label>
                {videoPreview && (
                  <div className="mb-3">
                    <video
                      src={typeof videoPreview === 'string' ? videoPreview : URL.createObjectURL(videoPreview)}
                      controls
                      className="w-full h-48 rounded-lg border border-gray-300"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setFormData({ ...formData, video: null });
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, video: file });
                      setVideoPreview(file);
                      // Clear video_url if uploading a file
                      if (formData.video_url) {
                        setFormData(prev => ({ ...prev, video_url: '' }));
                      }
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Upload a video file (MP4, MOV, etc.)
                </p>
              </div>
            </div>

            {/* Video URL (Alternative to upload) */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL (YouTube, Vimeo, etc.)
              </label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={formData.video_url}
                onChange={(e) => {
                  setFormData({ ...formData, video_url: e.target.value });
                  // Clear video file if using URL
                  if (e.target.value && formData.video) {
                    setFormData(prev => ({ ...prev, video: null }));
                    setVideoPreview(null);
                  }
                }}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a video URL from YouTube, Vimeo, or other platforms. If you upload a video file above, this will be ignored.
              </p>
            </div>
          </div>

          {/* Status & Workflow */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publish At
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                value={formData.publish_at}
                onChange={(e) => setFormData({ ...formData, publish_at: e.target.value })}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_slider}
                onChange={(e) => setFormData({ ...formData, is_slider: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Slider</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_breaking}
                onChange={(e) => setFormData({ ...formData, is_breaking: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Breaking</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.is_recommended}
                onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
              />
              <span className="ml-2 text-sm text-gray-700">Recommended</span>
            </label>
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Description
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
