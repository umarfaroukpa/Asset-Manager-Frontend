import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChange, logoutUser } from '../../config/firebase.config';
import { User as CustomUser, UserRole } from '../../types/auth.types';
import { User as FirebaseUser } from 'firebase/auth';

const Header: React.FC = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // Create custom user object from Firebase user
          const customUser: CustomUser = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            firstName: firebaseUser.displayName?.split(' ')[0] || '', // Extract from displayName if available
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '', // Extract remaining as lastName
            role: 'admin' as UserRole, // TODO: Fetch actual role from database
            organizationId: '', // TODO: Fetch from database
            permissions: [], // TODO: Fetch from database
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            department: '', // TODO: Fetch from database
            phone: '', // TODO: Fetch from database
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
          };
          
          console.log('User authenticated:', {
            id: customUser.id,
            email: customUser.email,
            role: customUser.role,
            displayName: customUser.displayName
          });
          
          setUser(customUser);
          setAuthError(null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error processing auth state change:', error);
        setAuthError('Authentication error occurred');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setIsMenuOpen(false);
      setAuthError(null);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthError('Failed to sign out');
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClass = "bg-indigo-100 text-indigo-700";
    const inactiveClass = "text-gray-700 hover:text-indigo-600 hover:bg-gray-50";
    
    return `${baseClass} ${isActiveRoute(path) ? activeClass : inactiveClass}`;
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.charAt(0)?.toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.name || user?.email?.split('@')[0] || 'User';
  };

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              AssetManager
            </Link>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-gray-500 text-sm">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        {/* Auth Error Alert */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{authError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setAuthError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={user ? "/dashboard" : "/"} 
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            AssetManager
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user ? (
              // Authenticated user navigation
              <>
                <Link
                  to="/dashboard"
                  className={navLinkClass("/dashboard")}
                >
                  Dashboard
                </Link>
                <Link
                  to="/assets"
                  className={navLinkClass("/assets")}
                >
                  Assets
                </Link>
                <Link
                  to="/organization"
                  className={navLinkClass("/organization")}
                >
                  Organization
                </Link>
                <Link
                  to="/profile"
                  className={navLinkClass("/profile")}
                >
                  Profile
                </Link>
                
                {/* Admin Dashboard Link */}
                {(user.role === 'admin' || user.role === 'owner') && (
                  <Link
                    to="/admin"
                    className={navLinkClass("/admin")}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                {/* User Info & Sign Out */}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-medium">
                        {getUserInitials()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {getUserDisplayName()}
                    </span>
                    {user.role && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {user.role}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Link
                  to="/"
                  className={navLinkClass("/")}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2 pt-4">
              {user ? (
                // Authenticated mobile navigation
                <>
                  <Link
                    to="/dashboard"
                    className={`${navLinkClass("/dashboard")} block`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/assets"
                    className={`${navLinkClass("/assets")} block`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Assets
                  </Link>
                  <Link
                    to="/organization"
                    className={`${navLinkClass("/organization")} block`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Organization
                  </Link>
                  <Link
                    to="/profile"
                    className={`${navLinkClass("/profile")} block`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  {/* Admin Dashboard Link - Mobile */}
                  {(user.role === 'admin' || user.role === 'owner') && (
                    <Link
                      to="/admin"
                      className={`${navLinkClass("/admin")} block`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {/* Mobile User Info */}
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-sm font-medium">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-medium">
                          {getUserDisplayName()}
                        </span>
                        {user.role && (
                          <span className="text-xs text-gray-500 capitalize">
                            {user.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors mt-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                // Unauthenticated mobile navigation
                <>
                  <Link
                    to="/"
                    className={`${navLinkClass("/")} block`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;