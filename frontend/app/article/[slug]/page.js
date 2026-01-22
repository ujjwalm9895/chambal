import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PublicService } from '@/lib/services/public-service';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  try {
    const article = await PublicService.getArticle(params.slug);
    
    return {
      title: article?.seo_title || article?.title,
      description: article?.seo_description || article?.content?.substring(0, 160) || '',
      openGraph: {
        title: article?.seo_title || article?.title,
        description: article?.seo_description || article?.content?.substring(0, 160) || '',
        images: article?.featured_image_url ? [article.featured_image_url] : [],
        type: 'article',
      },
    };
  } catch (error) {
    return {
      title: 'Article Not Found - Chambal Sandesh',
    };
  }
}

export default async function ArticlePage({ params }) {
  let article;
  
  try {
    article = await getArticle(params.slug);
  } catch (error) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="page-content">
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {article.category && (
          <Link 
            href={`/category/${article.category.slug}`}
            style={{ 
              display: 'inline-block', 
              marginBottom: '1rem',
              color: '#d32f2f',
              fontWeight: '500'
            }}
          >
            ← {article.category.name}
          </Link>
        )}

        <article>
          <h1 className="page-title">{article.title}</h1>
          
          <div style={{ 
            color: '#666', 
            marginBottom: '2rem',
            fontSize: '0.9rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {article.category && (
              <span>
                Category: <Link href={`/category/${article.category.slug}`}>{article.category.name}</Link>
              </span>
            )}
            {article.publish_at && (
              <span>
                Published: {new Date(article.publish_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
            {article.views_count > 0 && (
              <span>Views: {article.views_count}</span>
            )}
          </div>

          {article.featured_image_url && (
            <div style={{ marginBottom: '2rem' }}>
              <img 
                src={article.featured_image_url} 
                alt={article.title}
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}

          <div 
            className="article-content"
            style={{ 
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
