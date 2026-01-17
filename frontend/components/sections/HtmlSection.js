export default function HtmlSection({ data }) {
  const html = data?.html || data?.content || '';
  
  if (!html) {
    return null;
  }

  return (
    <section 
      className="html-section" 
      style={{ margin: '2rem 0' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
