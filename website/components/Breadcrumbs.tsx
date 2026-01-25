'use client';

import Link from 'next/link';

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">/</span>}
              {item.href && index < items.length - 1 ? (
                <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {item.label}
                </Link>
              ) : (
                <span className={index === items.length - 1 ? 'text-gray-900 dark:text-white font-medium' : ''}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
