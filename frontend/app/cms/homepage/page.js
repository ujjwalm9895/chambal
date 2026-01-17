'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { pageApi, pageSectionApi } from '@/lib/cms-api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX, FiArrowUp, FiArrowDown, FiArrowLeft } from 'react-icons/fi';

export default function HomepageBuilderPage() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get('page');
  const [currentPage, setCurrentPage] = useState(null);
  const [allPages, setAllPages] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    page: null,
    section_type: 'hero',
    data: {},
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchPagesAndSections();
  }, [pageId]);

  const fetchPagesAndSections = async () => {
    try {
      setLoading(true);
      // Fetch all pages
      const pagesResponse = await pageApi.list();
      const pages = Array.isArray(pagesResponse) ? pagesResponse : (pagesResponse.results || []);
      setAllPages(pages);
      
      // Determine which page to load
      let targetPage = null;
      if (pageId) {
        // If page ID is provided in query, use that
        targetPage = pages.find(p => p.id === Number(pageId));
      } else {
        // Otherwise, default to homepage (slug = 'home')
        targetPage = pages.find(p => p.slug === 'home');
      }
      
      if (targetPage) {
        setCurrentPage(targetPage);
        setFormData(prev => ({ ...prev, page: targetPage.id }));
        
        // Fetch full page details with sections
        try {
          const pageDetail = await pageApi.get(targetPage.id);
          if (pageDetail.sections && pageDetail.sections.length > 0) {
            setSections(pageDetail.sections.sort((a, b) => a.order - b.order));
          } else {
            // Fetch sections separately
            const sectionsResponse = await pageSectionApi.list({ page: targetPage.id });
            const sectionsList = Array.isArray(sectionsResponse) ? sectionsResponse : (sectionsResponse.results || []);
            setSections(sectionsList.sort((a, b) => a.order - b.order));
          }
        } catch (error) {
          // If page detail doesn't include sections, fetch separately
          const sectionsResponse = await pageSectionApi.list({ page: targetPage.id });
          const sectionsList = Array.isArray(sectionsResponse) ? sectionsResponse : (sectionsResponse.results || []);
          setSections(sectionsList.sort((a, b) => a.order - b.order));
        }
      } else if (pages.length > 0) {
        // If no target page found but pages exist, use first page or show message
        toast.error('Page not found. Please select a page.');
      }
    } catch (error) {
      console.error('Failed to load page:', error);
      toast.error('Failed to load page and sections');
    } finally {
      setLoading(false);
    }
  };

  const getDefaultData = (sectionType) => {
    const defaults = {
      hero: {
        title: 'Welcome to Chambal Sandesh',
        subtitle: 'Your trusted news source',
        image: '',
        cta_text: 'Read More',
        cta_link: '/articles',
      },
      slider: {
        title: 'Featured Stories',
        post_ids: [],
      },
      article_list: {
        title: 'Latest News',
        limit: 6,
        category: null,
        featured: false,
      },
      banner: {
        title: 'Special Offer',
        content: 'Subscribe to our newsletter',
        image: '',
        link: '/subscribe',
        style: 'primary',
      },
      html: {
        html: '<div><h2>Custom Content</h2><p>This is custom HTML content</p></div>',
      },
    };
    return defaults[sectionType] || {};
  };

  const handleAddSection = () => {
    if (!currentPage) {
      toast.error('Please select a page first');
      return;
    }
    const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order || 0)) : -1;
    setFormData({
      page: currentPage.id,
      section_type: 'hero',
      data: getDefaultData('hero'),
      order: maxOrder + 1,
      is_active: true,
    });
    setEditingSection(null);
    setShowForm(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setFormData({
      page: section.page || currentPage?.id,
      section_type: section.section_type,
      data: section.data || getDefaultData(section.section_type),
      order: section.order || 0,
      is_active: section.is_active !== undefined ? section.is_active : true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPage) {
      toast.error('Please select a page first');
      return;
    }
    try {
      const submitData = {
        page: currentPage.id,
        section_type: formData.section_type,
        data: formData.data,
        order: parseInt(formData.order) || 0,
        is_active: formData.is_active,
      };

      if (editingSection) {
        await pageSectionApi.update(editingSection.id, submitData);
        toast.success('Section updated successfully');
      } else {
        await pageSectionApi.create(submitData);
        toast.success('Section created successfully');
      }
      
      setShowForm(false);
      setEditingSection(null);
      fetchPagesAndSections();
    } catch (error) {
      console.error('Section save error:', error);
      let errorMessage = 'Failed to save section';
      if (error.response?.data) {
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

  const handleDeleteSection = async (id) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    try {
      await pageSectionApi.delete(id);
      toast.success('Section deleted');
      fetchPagesAndSections();
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const handleMoveSection = async (sectionId, direction) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const currentIndex = sections.findIndex(s => s.id === sectionId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= sections.length) return;

    const targetSection = sections[newIndex];
    const newOrder = targetSection.order;

    try {
      // Swap orders
      await pageSectionApi.update(sectionId, { order: newOrder });
      await pageSectionApi.update(targetSection.id, { order: section.order });
      toast.success('Section order updated');
      fetchPagesAndSections();
    } catch (error) {
      toast.error('Failed to update section order');
    }
  };

  const updateDataField = (key, value) => {
    setFormData({
      ...formData,
      data: {
        ...formData.data,
        [key]: value,
      },
    });
  };

  const renderDataFields = () => {
    const { section_type, data } = formData;

    switch (section_type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateDataField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Hero Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={data.subtitle || ''}
                onChange={(e) => updateDataField('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Hero Subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={data.image || ''}
                onChange={(e) => updateDataField('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/hero.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={data.cta_text || ''}
                  onChange={(e) => updateDataField('cta_text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Read More"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                <input
                  type="text"
                  value={data.cta_link || ''}
                  onChange={(e) => updateDataField('cta_link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="/articles"
                />
              </div>
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateDataField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Featured Stories"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post IDs (comma-separated)</label>
              <input
                type="text"
                value={Array.isArray(data.post_ids) ? data.post_ids.join(', ') : (data.post_ids || '')}
                onChange={(e) => {
                  const ids = e.target.value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                  updateDataField('post_ids', ids);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="1, 2, 3"
              />
              <p className="mt-1 text-xs text-gray-500">Enter post IDs separated by commas</p>
            </div>
          </div>
        );

      case 'article_list':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateDataField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Latest News"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={data.limit || 6}
                  onChange={(e) => updateDataField('limit', parseInt(e.target.value) || 6)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category ID (optional)</label>
                <input
                  type="number"
                  value={data.category || ''}
                  onChange={(e) => updateDataField('category', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Leave empty for all"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.featured || false}
                  onChange={(e) => updateDataField('featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Show only featured posts</span>
              </label>
            </div>
          </div>
        );

      case 'banner':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateDataField('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Special Offer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                rows="3"
                value={data.content || ''}
                onChange={(e) => updateDataField('content', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Subscribe to our newsletter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={data.image || ''}
                onChange={(e) => updateDataField('image', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={data.link || ''}
                  onChange={(e) => updateDataField('link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="/subscribe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
                <select
                  value={data.style || 'primary'}
                  onChange={(e) => updateDataField('style', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'html':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
            <textarea
              rows="10"
              value={data.html || ''}
              onChange={(e) => updateDataField('html', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
              placeholder="<div><h2>Custom Content</h2><p>This is custom HTML content</p></div>"
            />
            <p className="mt-1 text-xs text-gray-500">Enter raw HTML content</p>
          </div>
        );

      default:
        return <p className="text-gray-500">Select a section type to configure</p>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!currentPage && !pageId) {
    // Show page selector if no page is selected
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Page Sections Builder</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {allPages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No pages found. Create a page first.</p>
              <Link
                href="/cms/pages/new/edit"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create Page
              </Link>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Page to Manage Sections:
              </label>
              <select
                value=""
                onChange={(e) => {
                  const newPageId = e.target.value;
                  if (newPageId) {
                    window.location.href = `/cms/homepage?page=${newPageId}`;
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a page...</option>
                {allPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} ({page.slug})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentPage ? `${currentPage.title} - Sections` : 'Page Sections Builder'}
        </h1>
        <div className="flex items-center space-x-3">
          {currentPage && (
            <Link
              href={`/cms/pages/${currentPage.id}/edit`}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Edit Page
            </Link>
          )}
          {!showForm && (
            <button
              onClick={handleAddSection}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Section</span>
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingSection ? 'Edit Section' : 'Add New Section'}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingSection(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Type *</label>
                <select
                  required
                  value={formData.section_type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({
                      ...formData,
                      section_type: newType,
                      data: editingSection ? formData.data : getDefaultData(newType),
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="hero">Hero Section</option>
                  <option value="slider">Slider</option>
                  <option value="article_list">Article List</option>
                  <option value="banner">Banner</option>
                  <option value="html">HTML Content</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Section Data</h3>
              {renderDataFields()}
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {editingSection ? 'Update Section' : 'Create Section'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSection(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentPage ? `Manage Sections: ${currentPage.title}` : 'Page Sections'}
              </h2>
              {currentPage && (
                <p className="text-gray-600 mt-1">Page: /page/{currentPage.slug}/</p>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {currentPage && (
                <Link
                  href={`/cms/pages/${currentPage.id}/edit`}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Edit Page</span>
                </Link>
              )}
            </div>
          </div>

          {!currentPage && allPages.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Page to Manage Sections:
              </label>
              <select
                value={pageId || ''}
                onChange={(e) => {
                  const newPageId = e.target.value;
                  if (newPageId) {
                    window.location.href = `/cms/homepage?page=${newPageId}`;
                  } else {
                    window.location.href = '/cms/homepage';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a page...</option>
                {allPages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} ({page.slug})
                  </option>
                ))}
              </select>
            </div>
          )}

          {currentPage && (
            <p className="text-gray-600 mb-6">Manage sections for this page</p>
          )}

          {sections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No sections found. Add your first section to get started!</p>
              <button
                onClick={handleAddSection}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Section</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="text-lg font-medium text-gray-900">
                        {section.section_type_display || section.section_type}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        section.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {section.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span>Order: {section.order}</span>
                      {section.data?.title && (
                        <span className="ml-4">Title: {section.data.title}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMoveSection(section.id, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <FiArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <FiArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="p-2 text-primary-600 hover:text-primary-900"
                      title="Edit"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
