import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage           from './pages/LoginPage';
import SignupPage          from './pages/SignupPage';
import AdminDashboard      from './pages/AdminDashboard';
import UserDashboard       from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ProfilePage         from './pages/ProfilePage';
import NotFound            from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
            <Navbar />

            <main>
              <Routes>
                {/* Public routes */}
                <Route path="/login"  element={<LoginPage />}  />
                <Route path="/signup" element={<SignupPage />} />

                {/* Admin only */}
                <Route element={<ProtectedRoute roles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>

                {/* Normal user only */}
                <Route element={<ProtectedRoute roles={['user']} />}>
                  <Route path="/dashboard" element={<UserDashboard />} />
                </Route>

                {/* Store owner only */}
                <Route element={<ProtectedRoute roles={['owner']} />}>
                  <Route path="/owner" element={<StoreOwnerDashboard />} />
                </Route>

                {/* Authenticated (any role) */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Root redirect */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: '',
              style: {
                background: 'var(--color-card)',
                color:      'var(--color-text)',
                border:     '1px solid var(--color-border)',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
