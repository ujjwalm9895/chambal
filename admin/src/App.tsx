import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PagesList from './pages/PagesList';
import PageEditor from './pages/PageEditor';
import PostsList from './pages/PostsList';
import PostEditor from './pages/PostEditor';
import Categories from './pages/Categories';
import MediaLibrary from './pages/MediaLibrary';
import Menus from './pages/Menus';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/:id" element={<PostEditor />} />
          <Route path="categories" element={<Categories />} />
          <Route path="pages" element={<PagesList />} />
          <Route path="pages/:id" element={<PageEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="menus" element={<Menus />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
