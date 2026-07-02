import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
function PublicRoute({ children }) {
  const { token } = useAuth();
  return !token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/*"        element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e2029',
            color: '#e8eaf0',
            border: '1.5px solid #363a4d',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: { iconTheme: { primary: '#4ade80', secondary: '#1e2029' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1e2029' } },
        }}
      />
    </AuthProvider>
  );
}
