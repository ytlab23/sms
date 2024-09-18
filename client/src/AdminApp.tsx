import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import AdminPage from './pages/admin/AdminPage';
import AdminLayout from './layout/AdminLayout.tsx'; // Use a different layout for admin
import { AuthProvider } from './contexts/authcontext';
import AdminProtectedRoute from './contexts/AdminProtectedRoute';

function AdminApp() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <AdminLayout>
        <Routes>
          <Route
            path="/admin382013453sms"
            element={
              <AdminProtectedRoute>
                <>
                  <PageTitle title="Admin | SMSVerify" />
                  <AdminPage />
                </>
              </AdminProtectedRoute>
            }
          />
<Route path="*" element={<Navigate to="/admin382013453sms" />} />
</Routes>
      </AdminLayout>
    </AuthProvider>
  );
}

export default AdminApp;

