'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/actions/categories';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiCheckCircle, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

export default function CategoriesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    language: 'en',
    show_in_menu: true,
    menu_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Category fetch error:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name.trim());
      if (formData.slug && formData.slug.trim()) {
        data.append('slug', formData.slug.trim());
      }
      data.append('language', formData.language);
      data.append('show_in_menu', formData.show_in_menu.toString());
      data.append('menu_order', (formData.menu_order || 0).toString());
      data.append('is_active', formData.is_active.toString());
      
      let result;
      if (editingCategory) {
        result = await updateCategory(editingCategory.id, {}, data);
      } else {
        result = await createCategory({}, data);
      }

      if (result.errors) {
        // Show validation errors
        Object.values(result.errors).flat().forEach(err => toast.error(err));
        return;
      }

      if (result.message && !result.message.includes('successfully')) {
          toast.error(result.message);
          return;
      }

      toast.success(result.message);
      
      // Refresh list
      fetchCategories();

      setShowForm(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        language: 'en',
        show_in_menu: true,
        menu_order: 0,
        is_active: true,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      language: category.language,
      show_in_menu: category.showInMenu, // Note: Prisma uses camelCase
      menu_order: category.menuOrder,     // Prisma uses camelCase
      is_active: category.isActive,       // Prisma uses camelCase
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      language: 'en',
      show_in_menu: true,
      menu_order: 0,
      is_active: true,
    });
  };

  if (loading && !categories.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Form Modal/Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-500">
                <FiX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Leave empty to auto-generate"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Menu Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.menu_order}
                  onChange={(e) => setFormData({ ...formData, menu_order: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="show_in_menu"
                    type="checkbox"
                    checked={formData.show_in_menu}
                    onChange={(e) => setFormData({ ...formData, show_in_menu: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="show_in_menu" className="ml-2 block text-sm text-gray-900">
                    Show in Menu
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Language
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Menu Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{category.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.language === 'en' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {category.language === 'en' ? 'English' : 'Hindi'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.menuOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {category.isActive ? (
                    <FiCheckCircle className="text-green-500" />
                  ) : (
                    <FiX className="text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <FiEdit className="inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="inline" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
               <tr>
                 <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                   No categories found. Create one to get started.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
