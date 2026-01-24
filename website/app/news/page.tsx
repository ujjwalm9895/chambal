import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      cache: 'no-store',
      next: { revalidate: 0 },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-4xl font-bold mb-8">Latest News</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-500">No news articles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              {post.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link href={`/news/${post.slug}`} className="hover:text-blue-600 transition">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : new Date(post.createdAt).toLocaleDateString()}
                </p>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <Link
                  href={`/news/${post.slug}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Read more &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
