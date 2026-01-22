'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { getPost, createPost, updatePost } from '@/lib/actions/posts';
import { getCategories, createCategory } from '@/lib/actions/categories';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { FiPlus, FiX } from 'react-icons/fi';

// Dynamically import TipTap editor
const TipTapEditor = dynamic(() => import('@/components/cms/TipTapEditor'), { ssr: false });

export default function PostEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const postId = params.id === 'new' ? null : parseInt(params.id);
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
    fetchInitialData();
  }, []); // Run once on mount

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchInitialData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load categories', error);
      toast.error('Failed to load categories');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', newCategory.name.trim());
      data.append('language', newCategory.language);
      data.append('show_in_menu', String(newCategory.show_in_menu));
      data.append('menu_order', String(newCategory.menu_order || 0));
      data.append('is_active', String(newCategory.is_active));
      
      if (newCategory.slug && newCategory.slug.trim()) {
        data.append('slug', newCategory.slug.trim());
      }

      const result = await createCategory({}, data);

      if (result.errors) {
        Object.values(result.errors).flat().forEach(err => toast.error(err));
        return;
      }

      toast.success(result.message);
      setShowCategoryForm(false);
      setNewCategory({
        name: '',
        slug: '',
        language: formData.language,
        show_in_menu: true,
        menu_order: 0,
        is_active: true,
      });
      
      // Refresh categories
      const updatedCats = await getCategories();
      setCategories(updatedCats);
      
      // We don't have the ID of the new category easily unless createCategory returns it. 
      // Assuming user can find it in the list now.
      
    } catch (error) {
      console.error('Category creation error:', error);
      toast.error('Failed to create category');
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await getPost(postId);
      if (!post) {
          toast.error('Post not found');
          router.push('/cms/posts');
          return;
      }

      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.categoryId || '',
        language: post.language || 'en',
        status: post.status || 'draft',
        is_featured: post.isFeatured || false,
        is_slider: post.isSlider || false,
        is_breaking: post.isBreaking || false,
        is_recommended: post.isRecommended || false,
        publish_at: post.publishAt ? new Date(post.publishAt).toISOString().slice(0, 16) : '',
        seo_title: post.metaTitle || '',
        seo_description: post.metaDescription || '',
        featured_image: null,
        video: null,
        video_url: post.videoUrl || '',
      });
      
      if (post.featuredImage) {
        setFeaturedImagePreview(post.featuredImage);
      }
      if (post.videoUrl) {
        setVideoPreview(post.videoUrl);
      }
    } catch (error) {
      console.error('Fetch post error:', error);
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
      const data = new FormData();
      
      // Text fields
      if (formData.title) data.append('title', formData.title.trim());
      if (formData.slug && formData.slug.trim()) data.append('slug', formData.slug.trim());
      if (formData.content) data.append('content', formData.content);
      if (formData.excerpt && formData.excerpt.trim()) data.append('excerpt', formData.excerpt.trim());
      if (formData.category) data.append('categoryId', formData.category); // Mapped to categoryId
      if (formData.language) data.append('language', formData.language);
      if (formData.status) data.append('status', formData.status);
      
      // Booleans
      if (formData.is_featured) data.append('isFeatured', 'true');
      if (formData.is_slider) data.append('isSlider', 'true');
      if (formData.is_breaking) data.append('isBreaking', 'true');
      if (formData.is_recommended) data.append('isRecommended', 'true');
      
      // Meta / Optional
      if (formData.publish_at && formData.publish_at.trim()) data.append('publishAt', formData.publish_at);
      if (formData.seo_title && formData.seo_title.trim()) data.append('metaTitle', formData.seo_title.trim());
      if (formData.seo_description && formData.seo_description.trim()) data.append('metaDescription', formData.seo_description.trim());
      if (formData.video_url && formData.video_url.trim()) data.append('videoUrl', formData.video_url.trim());
      
      // Files
      if (formData.featured_image instanceof File) {
        data.append('featuredImage', formData.featured_image);
      }
      
      let result;
      if (postId) {
        result = await updatePost(postId, {}, data);
      } else {
        result = await createPost({}, data);
      }

      if (result.errors) {
        Object.values(result.errors).flat().forEach(err => toast.error(err));
      } else if (result.message && !result.message.includes('success')) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        router.push('/cms/posts');
      }

    } catch (error) {
      console.error('Post save error:', error);
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        if (name === 'featured_image') {
          setFeaturedImagePreview(previewUrl);
        } else if (name === 'video') {
          setVideoPreview(previewUrl);
        }
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
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
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (Optional)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={newCategory.language}
                  onChange={(e) => setNewCategory({ ...newCategory, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="cat_show_in_menu"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={newCategory.show_in_menu}
                  onChange={(e) => setNewCategory({ ...newCategory, show_in_menu: e.target.checked })}
                />
                <label htmlFor="cat_show_in_menu" className="ml-2 block text-sm text-gray-900">
                  Show in Menu
                </label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Leave empty to auto-generate from title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <div className="prose max-w-none">
                  <TipTapEditor content={formData.content} onChange={handleEditorChange} />
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  id="excerpt"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
              <div>
                <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  name="seo_title"
                  id="seo_title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700">
                  SEO Description
                </label>
                <textarea
                  name="seo_description"
                  id="seo_description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.seo_description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div>
                  <label htmlFor="publish_at" className="block text-sm font-medium text-gray-700">
                    Publish Date
                  </label>
                  <input
                    type="datetime-local"
                    name="publish_at"
                    id="publish_at"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={formData.publish_at}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Language
                </label>
                <select
                  name="language"
                  id="language"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(true)}
                    className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <FiPlus className="mr-1" /> New
                  </button>
                </div>
                <select
                  name="category"
                  id="category"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_featured"
                      name="is_featured"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_featured" className="font-medium text-gray-700">Featured</label>
                    <p className="text-gray-500">Show in featured section</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_slider"
                      name="is_slider"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={formData.is_slider}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_slider" className="font-medium text-gray-700">Slider</label>
                    <p className="text-gray-500">Show in homepage slider</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_breaking"
                      name="is_breaking"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={formData.is_breaking}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_breaking" className="font-medium text-gray-700">Breaking News</label>
                    <p className="text-gray-500">Show in breaking news ticker</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_recommended"
                      name="is_recommended"
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={formData.is_recommended}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_recommended" className="font-medium text-gray-700">Recommended</label>
                    <p className="text-gray-500">Show in recommended section</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {featuredImagePreview ? (
                      <div className="relative">
                        <img
                          src={featuredImagePreview}
                          alt="Preview"
                          className="mx-auto h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, featured_image: null }));
                            setFeaturedImagePreview(null);
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="featured_image"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="featured_image"
                              name="featured_image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleInputChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  name="video_url"
                  id="video_url"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={formData.video_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
