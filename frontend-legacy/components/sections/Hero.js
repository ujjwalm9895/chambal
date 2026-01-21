export default function Hero({ data }) {
  const title = data?.title || 'Welcome to Chambal Sandesh';
  const subtitle = data?.subtitle || 'Your trusted source for latest news and updates';
  const image = data?.image;
  const ctaText = data?.cta_text;
  const ctaLink = data?.cta_link;

  return (
    <section className="hero" style={image ? {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    } : {}}>
      <div className="container hero-content">
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        {ctaText && ctaLink && (
          <a 
            href={ctaLink} 
            className="btn btn-primary"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 2rem',
              background: '#d32f2f',
              color: '#fff',
              borderRadius: '4px',
              fontWeight: '600',
              transition: 'background 0.3s'
            }}
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
}
