'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { bulkUploadPosts } from '@/lib/actions/posts';
import { getCategories } from '@/lib/actions/categories';
import toast from 'react-hot-toast';
import { FiFileText, FiUpload, FiDownload, FiList, FiBook } from 'react-icons/fi';
import { FiCloud } from 'react-icons/fi';

export default function BulkUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await bulkUploadPosts({}, formData);
      
      if (result.message && result.message.includes('Imported')) {
          toast.success(result.message);
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          router.push('/cms/posts');
      } else {
          toast.error(result.message || 'Failed to upload posts');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = `title,content,category,status,language,excerpt,publish_at,is_featured,is_slider,is_breaking
"Sample Post Title","This is sample post content",1,published,en,"This is a sample excerpt","2024-01-01T12:00:00Z",false,false,false`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_post_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV template downloaded');
  };

  const handleDownloadExample = () => {
    // Create CSV example with multiple posts
    const csvContent = `title,content,category,status,language,excerpt,publish_at,is_featured,is_slider,is_breaking
"Breaking News Article","This is the content of the breaking news article...",1,published,en,"Brief excerpt for breaking news","2024-01-15T10:00:00Z",true,true,true
"Regular Article","This is the content of a regular article...",2,published,en,"Brief excerpt for regular article","2024-01-16T14:00:00Z",false,false,false
"Draft Article","This is draft content that needs review...",3,draft,en,"Brief excerpt for draft","2024-01-17T09:00:00Z",false,false,false`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_post_example.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV example downloaded');
  };

  const handleCategoryIdsList = async () => {
    try {
      // We'll use category API to get categories
      const categories = await getCategories();
      
      const csvContent = `id,name,slug,language
${Array.isArray(categories) ? categories.map(cat => `${cat.id},"${cat.name}","${cat.slug}",${cat.language}`).join('\n') : 'No categories found'}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'category_ids_list.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Category IDs list downloaded');
    } catch (error) {
      console.error('Failed to download category IDs:', error);
      toast.error('Failed to download category IDs list');
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bulk Post Upload</h1>
            <p className="text-gray-600 mt-2">You can add your posts with a CSV file from this section</p>
          </div>
          <Link
            href="/cms/posts"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiList className="w-5 h-5" />
            <span>Posts</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV File</h2>
          
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FiCloud className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Drag and drop files here or</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              Browse Files
            </label>
            
            {file && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Selected file: <span className="font-medium">{file.name}</span></p>
                <p className="text-xs text-gray-500 mt-1">Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">CSV Format Requirements:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>Required columns:</strong> title, content, category</li>
              <li><strong>Optional columns:</strong> status, language, excerpt, publish_at, is_featured, is_slider, is_breaking</li>
              <li><strong>Category:</strong> Use category ID (check "Category Ids list" in help documents)</li>
              <li><strong>Status:</strong> draft, pending, scheduled, or published</li>
              <li><strong>Language:</strong> en or hi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Help Documents */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Help Documents</h2>
        <p className="text-sm text-gray-600 mb-6">
          You can use these documents to generate your CSV file
        </p>

        <div className="space-y-3">
          <button
            onClick={handleCategoryIdsList}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiList className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Category Ids list</span>
          </button>

          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiDownload className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Download CSV Template</span>
          </button>

          <button
            onClick={handleDownloadExample}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiDownload className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Download CSV Example</span>
          </button>

          <button
            onClick={() => {
              // Open documentation or show info
              toast.info('Documentation coming soon');
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <FiBook className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Documentation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
