import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="error">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" style={{ 
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          background: '#d32f2f',
          color: '#fff',
          borderRadius: '4px',
          fontWeight: '600'
        }}>
          Go to Homepage
        </Link>
      </main>
      <Footer />
    </>
  );
}
