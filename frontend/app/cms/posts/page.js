'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getPosts, deletePost } from '@/lib/actions/posts';
import { getCategories } from '@/lib/actions/categories';
import { getUsers } from '@/lib/actions/users';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { format } from 'date-fns';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [filters, setFilters] = useState({
    language: '',
    postType: '', // status or type
    category: '',
    subcategory: '',
    user: '',
    search: '',
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [searchParams, currentPage, pageSize]);

  const fetchInitialData = async () => {
    try {
      const [categoriesData, usersData] = await Promise.all([
        getCategories(),
        getUsers(),
      ]);
      setCategories(categoriesData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load initial data', error);
      toast.error('Failed to load filters');
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize: pageSize,
        language: filters.language || undefined,
        status: filters.postType || undefined,
        category: filters.category || undefined,
        author: filters.user || undefined,
        search: filters.search || undefined,
      };

      const response = await getPosts(params);
      setPosts(response.results);
      setTotalCount(response.count);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Fetch posts error:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(id);
      toast.success('Post deleted');
      fetchPosts();
      setOpenDropdown(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete post');
    }
  };

  const toggleDropdown = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
        <div className="flex space-x-3">
            <Link
              href="/cms/posts/upload"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Bulk Upload
            </Link>
            <Link
              href="/cms/posts/new"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              New Post
            </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
          <div>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={filters.postType}
              onChange={(e) => handleFilterChange('postType', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
            >
              <option value="">All Authors</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name || user.username}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Search posts..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
           <div className="p-12 flex justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
           </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {post.featuredImage && (
                           <img 
                             src={post.featuredImage} 
                             alt="" 
                             className="h-10 w-10 rounded object-cover mr-3"
                           />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {post.language === 'en' ? 'English' : 'Hindi'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {post.author?.name || post.author?.username || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(post.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        
                        {openDropdown === post.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu">
                              <Link
                                href={`/cms/posts/${post.id}/edit`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Edit
                              </Link>
                              <a
                                href={`/article/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                View
                              </a>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                   <tr>
                     <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                       No posts found.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {/* Simple pagination for now */}
                      {[...Array(totalPages)].map((_, i) => (
                         <button
                           key={i + 1}
                           onClick={() => setCurrentPage(i + 1)}
                           className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                             currentPage === i + 1
                               ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                               : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                           }`}
                         >
                           {i + 1}
                         </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
