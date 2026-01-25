'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface Advertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'HEADER' | 'SIDEBAR' | 'FOOTER' | 'IN_CONTENT' | 'BOTTOM_BANNER';
}

interface AdBannerProps {
  position: 'HEADER' | 'SIDEBAR' | 'FOOTER' | 'IN_CONTENT' | 'BOTTOM_BANNER';
  className?: string;
}

export default function AdBanner({ position, className = '' }: AdBannerProps) {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_URL}/advertisements/public?position=${position}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
        });
        if (response.ok) {
          setAds(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch advertisements:', error);
      }
    };

    fetchAds();
    const interval = setInterval(fetchAds, 60 * 1000); // Refetch every minute
    return () => clearInterval(interval);
  }, [position]);

  if (ads.length === 0) return null;

  return (
    <div className={className}>
      {ads.map((ad) => {
        const content = (
          <div className="relative w-full overflow-hidden rounded">
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              width={1200}
              height={300}
              className="w-full h-auto object-cover"
            />
            {ad.description && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <p className="text-white text-sm text-center">{ad.description}</p>
              </div>
            )}
          </div>
        );

        if (ad.linkUrl) {
          return (
            <Link
              key={ad.id}
              href={ad.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition"
            >
              {content}
            </Link>
          );
        }

        return <div key={ad.id}>{content}</div>;
      })}
    </div>
  );
}
