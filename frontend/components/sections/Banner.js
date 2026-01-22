export default function Banner({ data }) {
  const title = data?.title || '';
  const content = data?.content || '';
  const image = data?.image;
  const link = data?.link;
  const style = data?.style || 'primary';

  if (!title && !content && !image) {
    return null;
  }

  const bannerContent = (
    <>
      {image && (
        <img 
          src={image} 
          alt={title || 'Banner'} 
          style={{ maxWidth: '100%', marginBottom: title || content ? '1rem' : '0' }}
        />
      )}
      {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
      {content && <p>{content}</p>}
    </>
  );

  if (link) {
    return (
      <section className={`banner banner-${style}`}>
        <a href={link} style={{ display: 'block', color: 'inherit' }}>
          {bannerContent}
        </a>
      </section>
    );
  }

  return (
    <section className={`banner banner-${style}`}>
      {bannerContent}
    </section>
  );
}
