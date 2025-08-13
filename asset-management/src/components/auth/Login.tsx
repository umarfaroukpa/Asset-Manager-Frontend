import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../config/firebase.config';
import { useComponentLogger } from '../../hooks/useLogger';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Use the functional logger with component-specific context
  const { logInfo, logError, logAuth, startTimer, endTimer } = useComponentLogger('Login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Log the login attempt
    logAuth('Login attempt started', { email });
    startTimer('login-process');

    try {
      logInfo('Attempting user authentication');
      await loginUser(email, password);
      
      logAuth('Login successful', { email });
      logInfo('Navigating to dashboard');
      
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      
      // Log the error with context
      logError('Login failed', {
        error: errorMessage,
        email,
        errorCode: error.code || 'UNKNOWN'
      });
      
      setError(errorMessage);
    } finally {
      endTimer('login-process');
      setLoading(false);
      logInfo('Login process completed');
    }
  };

  // Log component mount (optional)
  React.useEffect(() => {
    logInfo('Login component mounted');
    return () => logInfo('Login component unmounted');
  }, [logInfo]);

  return (
    <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 px-4">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Asset Manager
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;