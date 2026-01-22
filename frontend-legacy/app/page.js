import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { getHomepage } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Chambal Sandesh - Latest News & Updates',
  description: 'Your trusted source for latest news, updates, and stories from the Chambal region',
  openGraph: {
    title: 'Chambal Sandesh - Latest News & Updates',
    description: 'Your trusted source for latest news, updates, and stories from the Chambal region',
    type: 'website',
  },
};

async function getHomepageData() {
  try {
    console.log('Fetching homepage data from:', process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api');
    const data = await getHomepage();
    console.log('Homepage data fetched successfully:', data ? 'Has data' : 'No data');
    return data;
  } catch (error) {
    console.error('Error fetching homepage data:', error.message || error);
    return null;
  }
}

export default async function HomePage() {
  const homepageData = await getHomepageData();

  // If homepage page exists with sections, render those
  if (homepageData?.homepage_page?.sections) {
    return (
      <>
        <Navbar />
        <main>
          {homepageData.homepage_page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </main>
        <Footer />
      </>
    );
  }

  // Default homepage layout with featured and trending articles
  return (
    <>
      <Navbar />
      <main>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center' }}>
            Chambal Sandesh
          </h1>
          <p style={{ fontSize: '1.25rem', textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
            Your trusted source for latest news and updates
          </p>
        </div>

        {homepageData?.featured_posts && homepageData.featured_posts.length > 0 && (
          <SectionRenderer 
            section={{
              id: 'featured',
              section_type: 'article_list',
              is_active: true,
              data: {
                title: 'Featured Articles',
                articles: homepageData.featured_posts,
                limit: 6,
              }
            }}
          />
        )}

        {homepageData?.slider_posts && homepageData.slider_posts.length > 0 && (
          <SectionRenderer 
            section={{
              id: 'slider',
              section_type: 'slider',
              is_active: true,
              data: {
                title: 'Featured Stories',
                articles: homepageData.slider_posts,
                limit: 10,
              }
            }}
          />
        )}

        {homepageData?.breaking_posts && homepageData.breaking_posts.length > 0 && (
          <SectionRenderer 
            section={{
              id: 'breaking',
              section_type: 'article_list',
              is_active: true,
              data: {
                title: 'Breaking News',
                articles: homepageData.breaking_posts,
                limit: 5,
              }
            }}
          />
        )}

        {/* Latest Articles */}
        {homepageData?.latest_posts && homepageData.latest_posts.length > 0 ? (
          <SectionRenderer 
            section={{
              id: 'latest',
              section_type: 'article_list',
              is_active: true,
              data: {
                title: 'Latest News',
                articles: homepageData.latest_posts,
                limit: 9,
              }
            }}
          />
        ) : (
          <SectionRenderer 
            section={{
              id: 'latest',
              section_type: 'article_list',
              is_active: true,
              data: {
                title: 'Latest News',
                limit: 9,
              }
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
