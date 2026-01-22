'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getPublicArticles } from '@/lib/actions/public';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('Fetching articles...');
        const data = await getPublicArticles();
        console.log('Raw API response:', data);
        // Handle paginated response (DRF returns {results: [], count: N, ...})
        const articleList = Array.isArray(data) ? data : (data?.results || []);
        console.log('Processed articles:', articleList);
        setArticles(articleList);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">All Articles</h1>

        {loading && <p className="text-center text-gray-500">Loading articles...</p>}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && articles.length === 0 && (
          <p className="text-center text-gray-500">No articles found.</p>
        )}

        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.slug}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {article.featured_image_url && (
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.excerpt || 'No excerpt available'}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{article.category_name || 'Uncategorized'}</span>
                      <span>{article.publish_at ? new Date(article.publish_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
