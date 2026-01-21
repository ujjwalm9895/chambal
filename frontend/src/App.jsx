import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import CMSLayout from '@/layouts/CMSLayout';

// Public Pages
import HomePage from '@/pages/HomePage';
import ArticlePage from '@/pages/ArticlePage';
import CategoryPage from '@/pages/CategoryPage';
import LoginPage from '@/pages/cms/LoginPage';

// CMS Pages
import CMSDashboard from '@/pages/cms/Dashboard';
import CMSPosts from '@/pages/cms/Posts';

// Auth Guard
const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/cms/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
        </Route>

        {/* CMS Routes */}
        <Route path="/cms/login" element={<LoginPage />} />
        
        <Route path="/cms" element={<ProtectedRoute />}>
           <Route element={<CMSLayout />}>
              <Route index element={<CMSDashboard />} />
              <Route path="posts" element={<CMSPosts />} />
              {/* Add other CMS routes here */}
           </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;