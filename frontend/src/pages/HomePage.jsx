import { useEffect, useState } from 'react';
import { getHomepage } from '@/lib/api';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getHomepage();
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Latest News</h1>
      
      {/* Featured Posts */}
      {data?.featured_posts?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {data.featured_posts.map(post => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {post.featured_image_url && (
                <img src={post.featured_image_url} alt={post.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  <Link to={`/article/${post.slug}`} className="hover:text-red-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(post.publish_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}