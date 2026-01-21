import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategory } from '@/lib/api';

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getCategory(slug);
        setCategory(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!category) return <div className="text-center py-20">Category not found</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{category.name}</h1>
      
      <p className="text-gray-600 mb-8">Latest articles in {category.name}</p>
      
      {/* This would ideally use an ArticleList component, implementing basic grid for now */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Note: In a real implementation, we'd need to fetch articles for this category if not included in category response */}
        <div className="col-span-3 text-center text-gray-500 py-10 bg-gray-50 rounded">
          Articles for this category will appear here.
        </div>
      </div>
    </div>
  );
}