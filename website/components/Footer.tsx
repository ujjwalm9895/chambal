'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, MenuItem, Post } from '@/types';
import AdBanner from './AdBanner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface SiteSettings {
  aboutUs?: string;
  contactEmail?: string;
  copyrightText?: string;
  brandName?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  pinterestUrl?: string;
  linkedinUrl?: string;
  rssUrl?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
}

function getImageUrl(url: string | undefined): string {
  if (!url) return 'https://placehold.co/100x100/e2e8f0/1e293b?text=No+Image';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) {
    const baseUrl = API_URL.replace('/api/v1', '');
    return `${baseUrl}${url}`;
  }
  return url;
}

export default function Footer() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, settingsRes, postsRes] = await Promise.all([
          fetch(`${API_URL}/menus/location/footer`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
          fetch(`${API_URL}/site-settings`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
          fetch(`${API_URL}/posts?isFeatured=true&limit=3`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
          }),
        ]);

        if (menuRes.ok) setMenu(await menuRes.json());
        if (settingsRes.ok) setSettings(await settingsRes.json());
        if (postsRes.ok) setTrendingPosts(await postsRes.json());
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic - can be added later
    alert('Newsletter subscription functionality coming soon!');
    setEmail('');
  };

  const sortedItems = menu?.items
    ? [...menu.items].sort((a, b) => a.order - b.order)
    : [];

  const currentYear = new Date().getFullYear();
  const copyrightText = settings.copyrightText || `Copyright ${currentYear} Chambal Sandesh - All Rights Reserved.`;

  return (
    <footer className="bg-gray-900 dark:bg-black text-white mt-auto border-t border-gray-800 dark:border-gray-900">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - About Us */}
          <div>
            <div className="mb-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">{settings.brandName || 'Chambal Sandesh'}</span>
              </Link>
            </div>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {settings.aboutUs || "We're Chambal Sandesh, and we love sharing great stories and insights! We believe good writing should inform you, give you fresh ideas, and get you thinking. Our dedicated team works hard to bring you top-notch content that you'll genuinely enjoy reading."}
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-2">
              {settings.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-700 transition">
                  <span className="text-xs font-bold">f</span>
                </a>
              )}
              {settings.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-black dark:hover:bg-gray-800 transition">
                  <span className="text-xs font-bold">X</span>
                </a>
              )}
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-pink-600 dark:hover:bg-pink-700 transition">
                  <span className="text-xs">📷</span>
                </a>
              )}
              {settings.pinterestUrl && (
                <a href={settings.pinterestUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-700 transition">
                  <span className="text-xs font-bold">P</span>
                </a>
              )}
              {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-blue-700 dark:hover:bg-blue-800 transition">
                  <span className="text-xs font-bold">in</span>
                </a>
              )}
              {settings.rssUrl && (
                <a href={settings.rssUrl} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center hover:bg-orange-600 dark:hover:bg-orange-700 transition">
                  <span className="text-xs">📡</span>
                </a>
              )}
            </div>
          </div>

          {/* Center Column - Trending Posts */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Trending Posts</h3>
            <div className="space-y-4">
              {trendingPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/news/${post.slug}`} className="flex gap-3 group">
                  {post.featuredImage && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={getImageUrl(post.featuredImage)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-sm font-bold leading-snug mb-1 group-hover:text-blue-400 transition line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-400">By Admin</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column - Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Newsletter</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm mb-4">
              {settings.newsletterDescription || "Join our subscribers list to get the latest news, updates and special offers directly in your inbox"}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-700 rounded text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <AdBanner position="BOTTOM_BANNER" className="container mx-auto px-4 py-4" />

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
            <p>{copyrightText}</p>
            {sortedItems.length > 0 && (
              <div className="flex gap-4">
                {sortedItems.map((item: MenuItem) => (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-10 h-10 bg-black dark:bg-gray-800 text-white rounded flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-700 transition shadow-lg z-50"
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </footer>
  );
}
