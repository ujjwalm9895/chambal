import { notFound } from 'next/navigation';
import { getPublicPage } from '@/lib/actions/public';
import SectionRenderer from '@/components/sections/SectionRenderer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// ✅ Architecture Rule: Build vs Runtime
// force-dynamic ensures this page is built at REQUEST time, not BUILD time.
// This prevents "Connection Refused" errors during `next build` if backend is down.
export const dynamic = 'force-dynamic';

export default async function DynamicCMSPage({ params }) {
  // Join slug array into a path string (e.g. ['about', 'team'] -> 'about/team')
  const slugPath = params.slug?.join('/') || '';

  // ✅ Architecture Rule: Safe Fetching
  const pageData = await getPublicPage(slugPath);

  // ✅ Architecture Rule: Graceful 404
  if (!pageData) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Render sections dynamically based on CMS data */}
        {pageData.sections?.map((section, index) => (
          <SectionRenderer key={index} section={section} />
        ))}
      </main>
      <Footer />
    </>
  );
}

// Optional: Metadata generation from CMS
export async function generateMetadata({ params }) {
  const slugPath = params.slug?.join('/') || '';
  const pageData = await getPublicPage(slugPath);

  if (!pageData) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: pageData.title,
    description: pageData.seo_description,
  };
}
