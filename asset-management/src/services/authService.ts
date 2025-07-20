// src/services/authService.ts
import { LoginResponse, RegisterResponse, User, Organization } from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Type for auth state change listeners
type AuthStateListener = (user: User | null) => void;

/**
 * AuthService handles authentication and user management API calls.
 */
class AuthService {
  private listeners: AuthStateListener[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Check for existing token on initialization
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from localStorage
   */
  private async initializeAuth(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { user } = await this.verifyToken(token);
        this.currentUser = user;
        this.notifyListeners();
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        this.currentUser = null;
        this.notifyListeners();
      }
    } else {
      this.currentUser = null;
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(listener: AuthStateListener): () => void {
    this.listeners.push(listener);
    
    // Immediately call listener with current state
    listener(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of auth state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Makes an authenticated API request.
   * @param endpoint API endpoint
   * @param options Fetch options
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Log in a user with email and password.
   * @throws Error if login fails
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Store token and update auth state
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
        this.notifyListeners();
      }
      
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  /**
   * Register a new user.
   * @throws Error if registration fails
   */
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    organizationName: string;
    role: 'org_admin';
  }): Promise<RegisterResponse> {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      // Store token and update auth state
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
        this.notifyListeners();
      }
      
      return response;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Log out the current user.
   */
  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if API call fails, we still want to clear local state
      console.error('Logout API call failed:', error);
    } finally {
      // Clear token and update auth state
      localStorage.removeItem('token');
      this.currentUser = null;
      this.notifyListeners();
    }
  }

  /**
   * Verify a user token.
   */
  async verifyToken(token: string): Promise<{ user: User; organization: Organization }> {
    try {
      return await this.makeRequest('/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      throw new Error('Token verification failed.');
    }
  }

  /**
   * Create a staff account.
   */
  async createStaffAccount(staffData: {
    email: string;
    firstName: string;
    lastName: string;
    role: 'staff';
    permissions: string[];
  }): Promise<User> {
    try {
      return await this.makeRequest('/auth/create-staff', {
        method: 'POST',
        body: JSON.stringify(staffData),
      });
    } catch (error) {
      throw new Error('Failed to create staff account.');
    }
  }

  /**
   * Update user permissions.
   */
  async updateUserPermissions(userId: string, permissions: string[]): Promise<User> {
    try {
      return await this.makeRequest(`/auth/users/${userId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions }),
      });
    } catch (error) {
      throw new Error('Failed to update user permissions.');
    }
  }

  /**
   * Get all staff in the organization.
   */
  async getOrganizationStaff(): Promise<User[]> {
    try {
      return await this.makeRequest('/auth/organization/staff');
    } catch (error) {
      throw new Error('Failed to fetch organization staff.');
    }
  }

  /**
   * Deactivate a user.
   */
  async deactivateUser(userId: string): Promise<void> {
    try {
      return await this.makeRequest(`/auth/users/${userId}/deactivate`, {
        method: 'PUT',
      });
    } catch (error) {
      throw new Error('Failed to deactivate user.');
    }
  }

  /**
   * Reactivate a user.
   */
  async reactivateUser(userId: string): Promise<void> {
    try {
      return await this.makeRequest(`/auth/users/${userId}/reactivate`, {
        method: 'PUT',
      });
    } catch (error) {
      throw new Error('Failed to reactivate user.');
    }
  }
}

export const authService = new AuthService();

// Export the onAuthStateChange function for compatibility
export const onAuthStateChange = (listener: AuthStateListener): (() => void) => {
  return authService.onAuthStateChange(listener);
};