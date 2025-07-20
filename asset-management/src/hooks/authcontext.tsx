import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface Organization {
  id: string;
  name: string;
  domain?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (token: string, userData: User, orgData?: Organization) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string): Promise<void> => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.organization) {
          setOrganization(data.organization);
        }
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (token: string, userData: User, orgData?: Organization): Promise<void> => {
    localStorage.setItem('authToken', token);
    setUser(userData);
    if (orgData) {
      setOrganization(orgData);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('authToken');
    setUser(null);
    setOrganization(null);
  };

  const value: AuthContextType = {
    user,
    organization,
    loading,
    login,
    logout,
    isAuthenticated: Boolean(user)
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};