import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { getPublicPage } from '@/lib/actions/public';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  try {
    const page = await getPublicPage(params.slug);
    
    return {
      title: page?.seo_title || page?.title,
      description: page?.seo_description || '',
    };
  } catch (error) {
    return {
      title: 'Page Not Found - Chambal Sandesh',
    };
  }
}

export default async function CustomPage({ params }) {
  let page;
  
  try {
    page = await getPublicPage(params.slug);
  } catch (error) {
    notFound();
  }

  if (!page) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="container page-content">
          <h1 className="page-title">{page.title}</h1>
        </div>

        {/* Render all sections dynamically */}
        {page.sections && page.sections.length > 0 && (
          <>
            {page.sections.map((section) => (
              <SectionRenderer key={section.id} section={section} />
            ))}
          </>
        )}

        {/* If no sections, show basic page content */}
        {(!page.sections || page.sections.length === 0) && (
          <div className="container page-content">
            <p style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
              This page is managed through the CMS. Please add sections to display content.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
