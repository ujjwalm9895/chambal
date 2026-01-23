import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PagesList from './pages/PagesList';
import PageEditor from './pages/PageEditor';
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
          <Route path="pages" element={<PagesList />} />
          <Route path="pages/new" element={<PageEditor />} />
          <Route path="pages/:id" element={<PageEditor />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="menus" element={<Menus />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
