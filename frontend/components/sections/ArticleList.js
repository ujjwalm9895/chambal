'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicService } from '@/lib/services/public-service';

export default function ArticleList({ data, sliderMode = false }) {
  const [articles, setArticles] = useState(data?.articles || []);
  const [loading, setLoading] = useState(!data?.articles);

  useEffect(() => {
    // If articles are already provided, don't fetch
    if (data?.articles && data.articles.length > 0) {
      setLoading(false);
      return;
    }
    // Only fetch if we don't have articles
    if (!data?.articles || data.articles.length === 0) {
      fetchArticles();
    }
  }, [data]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (data?.category) params.category = data.category;
      if (data?.limit) params.limit = data.limit;
      if (data?.lang) params.lang = data.lang;

      const response = await PublicService.getArticles(params);
      setArticles(response?.results || response || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const title = data?.title || 'Latest Articles';
  const limit = data?.limit || 6;

  if (loading) {
    return (
      <section className="article-list-section" style={{ margin: '2rem 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>{title}</h2>
          <div className="loading">Loading articles...</div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="article-list-section" style={{ margin: '2rem 0' }}>
        <div className="container">
          <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>{title}</h2>
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 0', 
            color: '#666',
            fontSize: '1.125rem'
          }}>
            No articles found in this category yet.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="article-list-section" style={{ margin: '2rem 0' }}>
      <div className="container">
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>{title}</h2>
        <div className="article-grid">
          {articles.slice(0, limit).map((article) => (
            <article key={article.id} className="article-card">
              {article.featured_image_url && (
                <Link href={`/article/${article.slug}`}>
                  <img 
                    src={article.featured_image_url} 
                    alt={article.title}
                    className="article-card-image"
                    loading="lazy"
                  />
                </Link>
              )}
              <div className="article-card-content">
                {article.category_name && (
                  <div className="article-card-meta">
                    <Link href={`/category/${article.category_slug}`}>
                      {article.category_name}
                    </Link>
                  </div>
                )}
                <Link href={`/article/${article.slug}`}>
                  <h3 className="article-card-title">{article.title}</h3>
                </Link>
                {article.publish_at && (
                  <div className="article-card-meta">
                    {new Date(article.publish_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}
                {article.seo_description && (
                  <p className="article-card-excerpt">{article.seo_description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
