import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import { AuthProvider } from './hooks/authcontext';
import AppRoutes from './routes/AppRoutes';

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
              <AppRoutes />
            </Suspense>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;