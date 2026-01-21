import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticle } from '@/lib/api';
import { Helmet } from 'react-helmet-async';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getArticle(slug);
        setArticle(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!article) return <div className="text-center py-20">Article not found</div>;

  return (
    <>
      <Helmet>
        <title>{article.seo_title || article.title} - Chambal Sandesh</title>
        <meta name="description" content={article.seo_description || article.excerpt} />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center text-gray-500 mb-6 text-sm">
          {article.category && (
            <Link to={`/category/${article.category.slug}`} className="text-red-600 font-medium mr-4 hover:underline">
              {article.category.name}
            </Link>
          )}
          <span>{new Date(article.publish_at).toLocaleDateString()}</span>
        </div>

        {article.featured_image_url && (
          <img 
            src={article.featured_image_url} 
            alt={article.title} 
            className="w-full h-auto rounded-lg shadow-md mb-8"
          />
        )}

        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </>
  );
}