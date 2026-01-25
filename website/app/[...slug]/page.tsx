import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { renderSection } from '@/lib/sectionRenderer';
import Breadcrumbs from '@/components/Breadcrumbs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getPage(slug: string) {
  try {
    const response = await fetch(`${API_URL}/pages/public/${slug}`, {
      cache: 'no-store',
    });
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const slug = params.slug.join('/');
  const page = await getPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || '',
  };
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params.slug.join('/');
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  const slugParts = slug.split('/');
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    ...slugParts.map((part, index) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: index === slugParts.length - 1 ? undefined : `/${slugParts.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
        <div className="space-y-8">
          {page.sections?.map((section: any) => (
            <div key={section.id}>{renderSection(section)}</div>
          ))}
        </div>
      </div>
    </>
  );
}
