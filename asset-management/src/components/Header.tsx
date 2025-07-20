import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { onAuthStateChange, logoutUser } from '../config/firebase.config';
import { User as CustomUser, UserRole } from '../types/auth.types';
import { User as FirebaseUser } from 'firebase/auth';

const Header: React.FC = () => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser: FirebaseUser | null) => {
      // Transform Firebase User to CustomUser
      if (firebaseUser) {
        // You'll need to fetch additional user data (role, firstName, lastName, etc.)
        // from your database here. For now, providing defaults:
        const customUser: CustomUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          firstName: '', // Fetch from your database
          lastName: '',  // Fetch from your database
          role: 'super_admin' as UserRole,  // Use valid UserRole value
          organizationId: '', // Add organizationId - fetch from database
          permissions: [], // Add permissions array
          isActive: true, // Default value or fetch from database
          createdAt: new Date().toISOString(), // Convert to string
          updatedAt: new Date().toISOString(), // Convert to string
        };
        
        // Debug: Log the user object to see what we have
        console.log('User object in Header:', customUser);
        console.log('User role:', customUser.role);
        
        setUser(customUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
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

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              AssetManager
            </Link>
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
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
                {/* Super Admin Dashboard Link */}
                {user.role === 'super_admin' && (
                  <Link
                    to="/admin"
                    className={navLinkClass("/admin")}
                    onClick={() => console.log('Navigating to admin dashboard')}
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                {/* User Info & Sign Out */}
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 text-sm font-medium">
                        {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
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
                  
                  {/* Mobile User Info */}
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 text-sm font-medium">
                          {user.displayName?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {user.displayName || user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors mt-2"
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