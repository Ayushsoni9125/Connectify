import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import useSocketStore from './store/useSocketStore';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function ProtectedRoute({ children }) {
  const { authUser } = useAuthStore();
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { authUser } = useAuthStore();
  if (authUser) return <Navigate to="/" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-dark)',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(124,58,237,0.5)',
        animation: 'pulse-glow 2s ease-in-out infinite',
      }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="white" />
        </svg>
      </div>
      <div className="spinner" style={{ width: 24, height: 24 }} />
    </div>
  );
}

export default function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    checkAuth();
  }, []);

  // Connect/disconnect socket based on auth state
  useEffect(() => {
    if (authUser) {
      connectSocket(authUser._id);
    } else {
      disconnectSocket();
    }
  }, [authUser]);

  if (isCheckingAuth) return <LoadingScreen />;

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(19,19,31,0.95)',
            color: '#f0f0ff',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: 'white' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: 'white' },
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
