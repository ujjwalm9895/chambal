import Hero from './Hero';
import ArticleList from './ArticleList';
import Banner from './Banner';
import HtmlSection from './HtmlSection';

/**
 * Generic Section Renderer
 * Renders sections based on section_type from CMS
 */
export default function SectionRenderer({ section }) {
  if (!section) {
    return null;
  }

  // Check if section is active (if property exists)
  if (section.is_active === false) {
    return null;
  }

  switch (section.section_type) {
    case 'hero':
      return <Hero data={section.data} />;
    
    case 'slider':
      // Slider is rendered as ArticleList with specific post IDs
      return <ArticleList data={section.data} sliderMode={true} />;
    
    case 'article_list':
      return <ArticleList data={section.data} />;
    
    case 'banner':
      return <Banner data={section.data} />;
    
    case 'html':
      return <HtmlSection data={section.data} />;
    
    default:
      console.warn(`Unknown section type: ${section.section_type}`);
      return null;
  }
}
