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
const ReportBuilderPage = lazy(() => import('./pages/ReportBuilderPage'));
const ReportsListPage = lazy(() => import('./pages/ReportsListPage'));
const QRScannerComponent= lazy(() => import('./components/assets/QRScanner'));
const OrganizationPage = lazy(() => import('./pages/Organizations'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AssetPage = lazy(() => import('./pages/Assetpage'));
const PaymentCallback = lazy(() => import('./pages/PaymentCallback'));
const AssignAsset = lazy(() => import('./components/assets/AssignAsset'));
const Notifications = lazy(() => import('./components/Notifications'));

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

              {/* Notifications Routes */}
              <Route path="/notifications" element={<Notifications />} />

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

              {/* Assign Asset route */}
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

              {/* Report Builder - Main route */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                   <Layout>
                     <ReportBuilderPage />
                    </Layout>
                </ProtectedRoute>
              }
             />

             {/* Report Builder - Create new report */}
            <Route
                path="/reports/new"
              element={
              <ProtectedRoute>
                <Layout>
                 <ReportBuilderPage mode="create" />
                </Layout>
               </ProtectedRoute>
              }
            />

{/* Report Builder - Edit existing report */}
<Route
  path="/reports/edit/:reportId"
  element={
    <ProtectedRoute>
      <Layout>
        <ReportBuilderPage mode="edit" />
      </Layout>
    </ProtectedRoute>
  }
/>

{/* Report Builder - View/Preview report */}
<Route
  path="/reports/view/:reportId"
  element={
    <ProtectedRoute>
      <Layout>
        <ReportBuilderPage mode="view" />
      </Layout>
    </ProtectedRoute>
  }
/>

{/* Reports Dashboard/List */}
<Route
  path="/reports/dashboard"
  element={
    <ProtectedRoute>
      <Layout>
        <ReportsListPage />
      </Layout>
    </ProtectedRoute>
  }
/>

              {/* Redirect /report to /reports for backwards compatibility */}
                     <Route
                       path="/report"
                   element={<Navigate to="/reports" replace />}
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