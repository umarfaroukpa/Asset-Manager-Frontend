import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BarChart2, LineChart, PieChart } from 'lucide-react';
import ErrorBoundary from './components/common/ErrorBoundary'
import LoadingSpinner from './components/common/LoadingSpinner';

// Import Demo directly (not lazy) for debugging
import Demo from './pages/Demo';
import { AuthProvider } from './hooks/authcontext';

// Keep other components lazy loaded
const Login = lazy(() => import('./components/auth/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Register = lazy(() => import('./components/auth/Registration'));
const Layout = lazy(() => import('./components/common/Layout'));
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const ReportBuilder = lazy(() => import('./components/reports/ReportBuilder'));
const QRScannerComponent= lazy(() => import('./components/assets/QRScanner'));
const OrganizationPage = lazy(() => import('./pages/Organizations'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AssetPage = lazy(() => import('./pages/Assetpage'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));

// Loading component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <Router>
        <div className="App">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Test route - uncomment to test basic routing */}
              {/* <Route path="/" element={<TestHomePage />} /> */}
              
              {/* Demo is the default landing page - no header needed */}
              <Route path="/" element={<Demo />} />

              {/* Auth routes - no header needed */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Dashboard - with layout */}
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

              {/* Protected feature routes - with layout */}
              <Route
                path="/assets/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AssetPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Asset detail route with ID parameter - Fixed showSidebar prop */}
              <Route
                path="/assets/:id"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <AssetPage />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* AdminDashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Adding New Assets */}
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

              {/* Organization route */}
              <Route
                path="/organization"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <OrganizationPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Profile route */}
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
              
              {/* Report Builder route - Fixed with proper interface */}
              <Route
                path="/reports/generate"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ReportBuilder 
                        reportTypes={[
                          {
                            id: 'asset-summary',
                            name: 'Asset Summary',
                            icon: <BarChart2 className="w-5 h-5" />,
                            description: 'Overview of all assets',
                            chartType: 'bar'
                          },
                          {
                            id: 'maintenance-report',
                            name: 'Maintenance Report',
                            icon: <LineChart className="w-5 h-5" />,
                            description: 'Maintenance schedule and history',
                            chartType: 'line'
                          },
                          {
                            id: 'location-report',
                            name: 'Location Report',
                            icon: <PieChart className="w-5 h-5" />,
                            description: 'Assets by location',
                            chartType: 'pie'
                          }
                        ]}
                        availableFilters={[
                          {
                            id: 'date',
                            label: 'Date Range',
                            type: 'date'
                          },
                          {
                            id: 'location',
                            label: 'Location',
                            type: 'select',
                            options: [
                              { value: 'all', label: 'All Locations' },
                              { value: 'office', label: 'Office' },
                              { value: 'warehouse', label: 'Warehouse' },
                              { value: 'remote', label: 'Remote' }
                            ]
                          },
                          {
                            id: 'category',
                            label: 'Category',
                            type: 'select',
                            options: [
                              { value: 'all', label: 'All Categories' },
                              { value: 'electronics', label: 'Electronics' },
                              { value: 'furniture', label: 'Furniture' },
                              { value: 'vehicles', label: 'Vehicles' }
                            ]
                          },
                          {
                            id: 'status',
                            label: 'Status',
                            type: 'select',
                            options: [
                              { value: 'all', label: 'All Status' },
                              { value: 'active', label: 'Active' },
                              { value: 'inactive', label: 'Inactive' },
                              { value: 'maintenance', label: 'In Maintenance' }
                            ]
                          }
                        ]}
                        onGenerate={async (reportType, filters) => {
                              try {
                                // Real API call to generate report
                                const response = await fetch(`${import.meta.env.VITE_API_URL}/reports/generate`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                  },
                                  body: JSON.stringify({
                            type: reportType,
                                    filters
                                  })
                                });

                                if (!response.ok) {
                                  throw new Error('Failed to generate report');
                                }

                                const reportData = await response.json();
                                return reportData;
                              } catch (error) {
                                console.error('Report generation failed:', error);
                                throw new Error('Failed to generate report. Please try again.');
                              }
                        }}
                        onExport={(format, data) => {
                              try {
                                // Real API call to export report
                                const exportUrl = `${import.meta.env.VITE_API_URL}/reports/export?format=${format}`;
                                window.open(exportUrl, '_blank');
                              } catch (error) {
                                console.error('Export failed:', error);
                                // Fallback: download as JSON
                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `report-${Date.now()}.json`;
                                link.click();
                                window.URL.revokeObjectURL(url);
                              }
                        }}
                      />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              
              {/* QR Scanner route - Fixed with required props */}
              <Route
                path="/assets/scan"
                element={
                  <ProtectedRoute>
                    <Layout>
                          <QRScannerComponent 
                        isOpen={true}
                        onScan={(result) => {
                          console.log('QR Code scanned:', result);
                          // Handle scan result here
                        }}
                        onClose={() => {
                          // Handle close action here
                          window.history.back();
                        }}
                      />
                    </Layout>
                  </ProtectedRoute>
                }
              />
                  
                  {/* Payment Callback route */}
                  <Route
                    path="/payment/callback"
                    element={<PaymentCallback />}
                  />
              
              {/* Catch-all route redirects to demo */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;