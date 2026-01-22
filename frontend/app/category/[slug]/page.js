import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { getPublicCategory } from '@/lib/actions/public';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  try {
    const category = await getPublicCategory(params.slug);
    
    return {
      title: `${category?.name || 'Category'} - Chambal Sandesh`,
      description: `Latest articles in ${category?.name || 'this'} category`,
    };
  } catch (error) {
    return {
      title: 'Category Not Found - Chambal Sandesh',
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  let category;
  
  try {
    category = await getPublicCategory(params.slug);
    if (!category) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
          <h1 className="page-title">{category.name}</h1>
          <p style={{ color: '#666', fontSize: '1.125rem', marginBottom: '1rem' }}>
            {category.language_display || (category.language ? category.language.toUpperCase() : 'EN')} Category
          </p>
          {category.show_in_menu && (
            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Showing articles in this category
            </p>
          )}
        </div>

        <SectionRenderer 
          section={{
            id: 'category-articles',
            section_type: 'article_list',
            is_active: true,
            data: {
              title: `Articles in ${category.name}`,
              category: category.slug,
              limit: 20,
              lang: category.language,
            }
          }}
        />
      </main>
      <Footer />
    </>
  );
}
