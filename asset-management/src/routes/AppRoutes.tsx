import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/authcontext';

// Auth Components
import Login from '../components/auth/Login';
import Registration from '../components/auth/Registration';

// Main App Components
import Dashboard from '../pages/Dashboard';
import WelcomeOnboarding from '../components/WelcomeOnboarding';
import SubscriptionPage from '../pages/SubscriptionPage';
import CheckoutFlow from '../components/CheckoutFlow';

// Other Pages
import Demo from '../pages/Demo';
import AssetPage from '../pages/Assetpage';
import CreateAsset from '../pages/CreateAsset';
import EditAssets from '../pages/EditAssets';
import ProfilePage from '../pages/ProfilePage';
import Organizations from '../pages/Organizations';
import AssetsDetails from '../pages/AssetsDetails';

// Protected Route Component
import ProtectedRoute from '../components/ProtectedRoute';

// Layout Component
import Layout from '../components/common/Layout';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Demo />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Registration />} />
      
      {/* Onboarding Route - Accessible to authenticated users */}
      <Route 
        path="/welcome" 
        element={
          <ProtectedRoute>
            <WelcomeOnboarding />
          </ProtectedRoute>
        } 
      />
      
      {/* Subscription Routes */}
      <Route 
        path="/subscription" 
        element={
          <ProtectedRoute>
            <Layout>
              <SubscriptionPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <CheckoutFlow />
          </ProtectedRoute>
        } 
      />
      
      {/* Main App Routes - Protected */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assets" 
        element={
          <ProtectedRoute>
            <Layout>
              <AssetPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assets/create" 
        element={
          <ProtectedRoute>
            <Layout>
              <CreateAsset />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assets/edit/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditAssets />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assets/:id" 
        element={
          <ProtectedRoute>
            <Layout>
              <AssetsDetails />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Layout>
              <ProfilePage />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/organizations" 
        element={
          <ProtectedRoute>
            <Layout>
              <Organizations />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
