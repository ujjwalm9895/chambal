'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMenus, createMenu, updateMenu, deleteMenu } from '@/lib/actions/menus';
import { getCategories } from '@/lib/actions/categories';
import { getPages } from '@/lib/actions/pages';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

export default function MenusPage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    menu_type: 'navbar',
    link_type: 'category',
    category: '',
    page: '',
    external_url: '',
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchMenus();
    fetchCategories();
    fetchPages();
  }, []);

  // Re-fetch categories when form is shown to ensure latest data
  useEffect(() => {
    if (showForm) {
      fetchCategories();
      fetchPages();
    }
  }, [showForm]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      console.error('Menu fetch error:', error);
      toast.error('Failed to load menus');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchPages = async () => {
    try {
      const data = await getPages();
      setPages(data);
    } catch (error) {
      console.error('Failed to load pages');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('menu_type', formData.menu_type);
      data.append('link_type', formData.link_type);
      data.append('order', formData.order || 0);
      data.append('is_active', String(formData.is_active));

      // Set the appropriate link based on link_type
      if (formData.link_type === 'category' && formData.category) {
        data.append('category', formData.category);
      } else if (formData.link_type === 'page' && formData.page) {
        data.append('page', formData.page);
      } else if (formData.link_type === 'url' && formData.external_url) {
        data.append('external_url', formData.external_url.trim());
      }

      let result;
      if (editingMenu) {
        result = await updateMenu(editingMenu.id, {}, data);
      } else {
        result = await createMenu({}, data);
      }

      if (result.errors) {
        Object.values(result.errors).flat().forEach(err => toast.error(err));
      } else if (result.message && !result.message.includes('success')) {
        toast.error(result.message);
      } else {
        toast.success(result.message);
        setShowForm(false);
        setEditingMenu(null);
        setFormData({
          title: '',
          menu_type: 'navbar',
          link_type: 'category',
          category: '',
          page: '',
          external_url: '',
          order: 0,
          is_active: true,
        });
        fetchMenus();
      }
    } catch (error) {
      console.error('Menu save error:', error);
      toast.error('Failed to save menu');
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setFormData({
      title: menu.title,
      menu_type: menu.menu_type,
      link_type: menu.link_type,
      category: menu.category?.id || '',
      page: menu.page?.id || '',
      external_url: menu.external_url || '',
      order: menu.order,
      is_active: menu.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await deleteMenu(id);
      toast.success('Menu item deleted');
      fetchMenus();
    } catch (error) {
      toast.error('Failed to delete menu item');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMenu(null);
    setFormData({
      title: '',
      menu_type: 'navbar',
      link_type: 'category',
      category: '',
      page: '',
      external_url: '',
      order: 0,
      is_active: true,
    });
  };

  const getMenuTypeBadge = (type) => {
    const colors = {
      navbar: 'bg-blue-100 text-blue-800',
      footer: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || colors.navbar}`}>
        {type === 'navbar' ? 'Navbar' : 'Footer'}
      </span>
    );
  };

  const getLinkTypeBadge = (type) => {
    const colors = {
      category: 'bg-green-100 text-green-800',
      page: 'bg-orange-100 text-orange-800',
      url: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[type] || colors.category}`}>
        {type === 'category' ? 'Category' : type === 'page' ? 'Page' : 'External URL'}
      </span>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Menus</h1>
        {!showForm && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                fetchMenus();
                fetchCategories();
                fetchPages();
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              title="Refresh"
            >
              <span>↻ Refresh</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>Add Menu Item</span>
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingMenu ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          {/* Info Alert */}
          {formData.link_type === 'category' && categories.length === 0 && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>⚠️ No Categories Available:</strong> You need to create categories before adding category menu items. 
                <Link href="/cms/categories" className="ml-1 text-primary-600 hover:underline font-medium">Create Categories →</Link>
              </p>
            </div>
          )}
          
          {formData.link_type === 'page' && pages.length === 0 && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>⚠️ No Pages Available:</strong> You need to create pages before adding page menu items. 
                <Link href="/cms/pages" className="ml-1 text-primary-600 hover:underline font-medium">Create Pages →</Link>
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Menu item title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Menu Type *
                </label>
                <select
                  required
                  value={formData.menu_type}
                  onChange={(e) => setFormData({ ...formData, menu_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="navbar">Navbar</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Type *
                </label>
                <select
                  required
                  value={formData.link_type}
                  onChange={(e) => setFormData({ ...formData, link_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="category">Category</option>
                  <option value="page">Page</option>
                  <option value="url">External URL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conditional fields based on link_type */}
            {formData.link_type === 'category' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={categories.length === 0}
                >
                  <option value="">
                    {categories.length === 0 
                      ? 'No categories available - Create categories first' 
                      : 'Select Category'}
                  </option>
                  {categories.length > 0 && (
                    categories
                      .filter(cat => cat.is_active !== false)
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.language_display || (cat.language ? cat.language.toUpperCase() : 'EN')})
                        </option>
                      ))
                  )}
                </select>
                {categories.length === 0 && (
                  <p className="mt-1 text-sm text-amber-600">
                    ⚠️ No categories found. <Link href="/cms/categories" className="text-primary-600 hover:underline">Create categories first</Link>
                  </p>
                )}
              </div>
            )}

            {formData.link_type === 'page' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page *
                </label>
                <select
                  required
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={pages.length === 0}
                >
                  <option value="">
                    {pages.length === 0 
                      ? 'No pages available - Create pages first' 
                      : 'Select Page'}
                  </option>
                  {pages.length > 0 && (
                    pages
                      .filter(p => p.is_active !== false)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))
                  )}
                </select>
                {pages.length === 0 && (
                  <p className="mt-1 text-sm text-amber-600">
                    ⚠️ No pages found. <Link href="/cms/pages" className="text-primary-600 hover:underline">Create pages first</Link>
                  </p>
                )}
              </div>
            )}

            {formData.link_type === 'url' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.external_url}
                  onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            )}

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
                {editingMenu ? 'Update Menu' : 'Create Menu'}
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
                    Menu Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.map((menu) => (
                  <tr key={menu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{menu.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getMenuTypeBadge(menu.menu_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLinkTypeBadge(menu.link_type)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {menu.link_type === 'category' && menu.category
                        ? `${menu.category.name || 'N/A'}`
                        : menu.link_type === 'page' && menu.page
                        ? `${menu.page.title || 'N/A'}`
                        : menu.link_type === 'url' && menu.external_url
                        ? menu.external_url.length > 40
                          ? `${menu.external_url.substring(0, 40)}...`
                          : menu.external_url
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {menu.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {menu.is_active ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(menu)}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {menus.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">No menu items found. Create your first menu item!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
