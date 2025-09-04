import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BarChart2, LineChart, PieChart } from 'lucide-react';
import { useAuth } from '../hooks/authcontext';
import Demo from '../pages/Demo';

// Auth Components
const Login = lazy(() => import('../components/auth/Login'));
const Registration = lazy(() => import('../components/auth/Registration'));

// Main App Components
const Dashboard = lazy(() => import('../pages/Dashboard'));
const WelcomeOnboarding = lazy(() => import ('../components/WelcomeOnboarding'));
const SubscriptionPage = lazy(() => import ('../pages/SubscriptionPage'));
const CheckoutFlow = lazy(() => import ('../components/CheckoutFlow'));
const PaymentCallback = lazy(() => import('../pages/PaymentCallback'));
// Other Pages
const AssetPage = lazy(() => import('../pages/Assetpage'));
const CreateAsset = lazy(() => import ('../pages/CreateAsset'));
const EditAssets = lazy(() => import ('../pages/EditAssets'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const Organizations = lazy(() => import('../pages/Organizations'));
const AssetsDetails = lazy(() => import ('../pages/AssetsDetails'));
const AdminDashboard = lazy(() => import('../admin/AdminDashboard'));
const AssignAsset = lazy(() => import('../components/assets/AssignAsset'));
const QRScannerComponent = lazy(() => import('../components/assets/QRScanner'));

// Protected Route Component
const ProtectedRoute = lazy(() => import('../components/ProtectedRoute'));

// Layout Component
const Layout = lazy(() => import ('../components/common/Layout'));
const ReportBuilder = lazy(() => import('../components/reports/ReportBuilder'));


interface ReportData {
  reportType: string;
  filters: Record<string, any>;
  data: any;
  generatedAt: string;
  summary?: {
    totalRecords: number;
    totalValue: number;
    categories: string[];
    locations?: string[];
    departments?: string[];
  };
}

// Define sample reportTypes and availableFilters
const reportTypes = [
  {
    id: 'sales',
    name: 'Sales Report',
    icon: <BarChart2 />,
    description: 'View sales performance over time',
    chartType: 'bar' as const,
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    icon: <PieChart />,
    description: 'Analyze inventory levels',
    chartType: 'pie' as const,
  },
  {
    id: 'trends',
    name: 'Trends Report',
    icon: <LineChart />,
    description: 'Track trends over time',
    chartType: 'line' as const,
  },
];

const availableFilters = [
  {
    id: 'dateRange',
    label: 'Date Range',
    type: 'date' as const,
  },
  {
    id: 'category',
    label: 'Category',
    type: 'select' as const,
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'accessories', label: 'Accessories' },
    ],
  },
];

// Define onGenerate and onExport handlers
const onGenerate = async (reportType: string, filters: Record<string, any>): Promise<ReportData> => {
  console.log('Generating report:', reportType, filters);
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reportType,
        filters,
        data: {
          tableData: [
            ['Sample ID', 'Sample Item', reportType, 'Sample Location', 'Active', '1000', 'Unassigned', '2023-01-01', 'N/A'],
          ],
          headers: ['ID', 'Name', 'Category', 'Location', 'Status', 'Value', 'Assigned To', 'Purchase Date', 'Serial Number'],
        },
        generatedAt: new Date().toISOString(),
        summary: {
          totalRecords: 1,
          totalValue: 1000,
          categories: [reportType],
          locations: ['Sample Location'],
          departments: ['Sample Department'],
        },
      });
    }, 1000);
  });
};

const onExport = async (format: 'pdf' | 'csv' | 'excel', data: ReportData): Promise<void> => {
  console.log(`Exporting report in ${format} format:`, data);
  // Simulate async export operation
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Completed export to ${format}`);
      resolve();
    }, 500);
  });
};


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
      { /* Checkout Flow Route - Accessible to authenticated users */}
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
        {/* Assets Route - Protected */}
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
        {/* Create Assets Route - Protected */}
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
      {/* Edit Assets Route - Protected */}
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
      {/* Asset Details Route - Protected */}
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
      {/* Asset New Route - Protected*/}
      
      <Route 
        path="/assets/new" 
        element={
          <ProtectedRoute>
            <Layout>
              <AssetPage />
            </Layout>
          </ProtectedRoute>
        } 
      />
       {/*Asset Assign Route - Protected*/}
      <Route 
        path="/assets/assign" 
        element={
          <ProtectedRoute>
            <Layout>
              <AssignAsset />
            </Layout>
          </ProtectedRoute>
        } 
      />
        {/* Asset ScanRoute -Protected */}
        <Route 
          path="/assets/scan" 
          element={
            <ProtectedRoute>
              <Layout>
                <QRScannerComponent 
                  onScan={(data: string) => { /* handle scan result */ }} 
                  onClose={() => { /* handle close */ }} 
                  isOpen={true} 
                />
              </Layout>s
            </ProtectedRoute>
          } 
        />

      {/* Profile Route - Protected */}
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
      {/* Organizations Route - Protected */}
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
      {/* Admin Dashboard Route - Protected */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Report Builder route with props */}
        <Route
          path="/reports/builder"
          element={
            <ProtectedRoute>
                <Layout>
                   <ReportBuilder
                     reportTypes={reportTypes}
                     availableFilters={availableFilters}
                     onGenerate={onGenerate}
                     onExport={onExport}
                     onSave={async (reportConfig: { name: string; type: string; filters: Record<string, any>; description?: string }) => {
                       // handle save
                       return Promise.resolve();
                     }}
                     saveEnabled={true}
                   />
                    </Layout>
            </ProtectedRoute>
          }

        />

      {/* Organizations Route - Protected */}
      <Route 
        path="/organization" 
        element={
          <ProtectedRoute>
            <Layout>
              <Organizations />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
