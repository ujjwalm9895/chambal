import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/types';
import AdBanner from '@/components/AdBanner';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getPosts(query: string = ''): Promise<Post[]> {
  try {
    const fullUrl = `${API_URL}/posts?${query}`;
    const response = await fetch(fullUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error(`Error fetching posts (${query}):`, error);
    return [];
  }
}

function getImageUrl(url: string | undefined): string {
  if (!url) return 'https://placehold.co/800x600/e2e8f0/1e293b?text=No+Image'; // Fallback
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) {
     const baseUrl = API_URL.replace('/api/v1', '');
     return `${baseUrl}${url}`;
  }
  return url;
}

function CategoryBadge({ category, className = "" }: { category?: Category, className?: string }) {
  if (!category) return null;
  return (
    <span 
      className={`px-3 py-1 text-xs font-bold text-white uppercase tracking-wider rounded inline-block ${className}`}
      style={{ backgroundColor: category.color || '#3b82f6' }}
    >
      {category.name}
    </span>
  );
}

export default async function Home() {
  // Fetch data
  const sliderPosts = await getPosts('isSlider=true&limit=3'); // We need 3 for the Bento grid (1 main + 2 side)
  const featuredPosts = await getPosts('isFeatured=true&limit=6');
  const breakingPosts = await getPosts('isBreaking=true&limit=5');
  const latestPosts = await getPosts('limit=10');

  // Main Hero Post (Left)
  const mainHeroPost = sliderPosts[0];
  // Side Hero Posts (Right)
  const sideHeroPosts = sliderPosts.slice(1, 3);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Breaking News Ticker */}
      {breakingPosts.length > 0 && (
        <div className="border-b border-gray-200">
          <div className="container mx-auto px-4 flex items-center h-12">
            <div className="bg-black text-white px-4 h-full flex items-center font-bold uppercase text-xs tracking-wider flex-shrink-0">
              <span className="mr-2">⚡</span> Breaking News
            </div>
            <div className="flex-grow overflow-hidden relative h-full flex items-center pl-4 bg-white dark:bg-gray-800">
              <div className="animate-marquee whitespace-nowrap">
                {breakingPosts.map((post) => (
                  <span key={post.id} className="mr-12 text-sm font-medium text-gray-800 dark:text-gray-200">
                    <Link href={`/news/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-1 pl-4">
              <button className="w-6 h-6 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">‹</button>
              <button className="w-6 h-6 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs">›</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section (Bento Grid) */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          
          {/* Main Hero (Left - 2 Cols) */}
          {mainHeroPost ? (
            <div className="lg:col-span-2 relative h-[500px] group overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Link href={`/news/${mainHeroPost.slug}`} className="block h-full w-full">
                <Image
                  src={getImageUrl(mainHeroPost.featuredImage)}
                  alt={mainHeroPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="mb-3">
                    <CategoryBadge category={mainHeroPost.category} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
                    {mainHeroPost.title}
                  </h2>
                  <div className="flex items-center text-gray-300 text-sm gap-4">
                    <span>By Chambal Team</span>
                    <span>•</span>
                    <span>{new Date(mainHeroPost.publishedAt || mainHeroPost.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </div>
          ) : (
            // Placeholder if no content
            <div className="lg:col-span-2 h-[500px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No Slider Posts Available
            </div>
          )}

          {/* Side Hero (Right - 1 Col, 2 Rows) */}
          <div className="flex flex-col gap-1 h-[500px]">
            {sideHeroPosts.map((post) => (
              <div key={post.id} className="relative flex-1 group overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Link href={`/news/${post.slug}`} className="block h-full w-full">
                  <Image
                    src={getImageUrl(post.featuredImage)}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <div className="mb-2">
                      <CategoryBadge category={post.category} />
                    </div>
                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
            {/* Fill empty slots if less than 2 side posts */}
            {[...Array(2 - sideHeroPosts.length)].map((_, i) => (
              <div key={`empty-${i}`} className="flex-1 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                Add more Slider posts
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured & Latest Split */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Column */}
          <div className="lg:w-3/4">
            
            {/* Category Section Example (e.g. Internet & Web) */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Featured News</h3>
                <Link href="/news" className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 uppercase">View All</Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <article key={post.id} className="flex flex-col group">
                    <div className="relative h-60 overflow-hidden mb-4 rounded-sm bg-gray-100 dark:bg-gray-800">
                      <Link href={`/news/${post.slug}`}>
                        <Image
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <CategoryBadge category={post.category} />
                        </div>
                      </Link>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-gray-900 dark:text-white">
                        <Link href={`/news/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">{post.excerpt}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Latest List */}
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Latest Stories</h3>
              </div>
              <div className="flex flex-col gap-8">
                {latestPosts.map((post) => (
                  <article key={post.id} className="flex gap-6 group border-b border-gray-100 dark:border-gray-700 pb-8 last:border-0">
                    <div className="w-1/3 relative h-32 md:h-40 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800">
                      <Link href={`/news/${post.slug}`}>
                        <Image
                          src={getImageUrl(post.featuredImage)}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="mb-2">
                        <CategoryBadge category={post.category} className="!py-0.5 !px-2 !text-[10px] !mb-1" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-gray-900 dark:text-white">
                        <Link href={`/news/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 hidden md:block mb-2">{post.excerpt}</p>
                      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-gray-300">By Admin</span>
                        <span>•</span>
                        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/4 space-y-8">
            {/* Sidebar Ad */}
            <AdBanner position="SIDEBAR" />

            {/* Social Widget */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 text-center">
              <h4 className="font-bold uppercase tracking-wider mb-4 text-gray-900 dark:text-white">Follow Us</h4>
              <div className="flex justify-center gap-2">
                {['fb', 'tw', 'in', 'yt'].map(s => (
                  <div key={s} className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-gray-600 hover:text-white transition cursor-pointer">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Trending/Sidebar List */}
            <div className="mb-8">
              <h4 className="font-black uppercase tracking-tight border-b-2 border-black mb-6 pb-2 inline-block">Trending</h4>
              <div className="flex flex-col gap-6">
                {featuredPosts.slice(0, 4).map((post, i) => (
                  <div key={post.id} className="group">
                    <span className="text-4xl font-black text-gray-200 float-left mr-3 leading-none -mt-2">0{i+1}</span>
                    <h5 className="font-bold leading-snug group-hover:text-blue-600 transition">
                      <Link href={`/news/${post.slug}`}>{post.title}</Link>
                    </h5>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-blue-600 text-white p-8 text-center">
              <h4 className="font-bold text-xl mb-2">Subscribe</h4>
              <p className="text-blue-100 text-sm mb-4">Get the latest news directly to your inbox.</p>
              <input type="email" placeholder="Your email address" className="w-full p-3 text-black text-sm mb-2 outline-none" />
              <button className="w-full bg-black text-white font-bold uppercase text-xs py-3 tracking-widest hover:bg-gray-900">Sign Up</button>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
