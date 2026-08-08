import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Calendar from './pages/Calendar';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import Export from './pages/Export';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'Admin') return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <Layout>
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/bookings" element={
            <Layout>
              <ProtectedRoute><Bookings /></ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/calendar" element={
            <Layout>
              <ProtectedRoute><Calendar /></ProtectedRoute>
            </Layout>
          } />
          
          <Route path="/admin" element={
            <Layout>
              <AdminRoute><Admin /></AdminRoute>
            </Layout>
          } />
          
          <Route path="/users" element={
            <Layout>
              <AdminRoute><AdminUsers /></AdminRoute>
            </Layout>
          } />
          
          <Route path="/export" element={
            <Layout>
              <AdminRoute><Export /></AdminRoute>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;