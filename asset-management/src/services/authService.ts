// src/services/authService.ts
import { LoginResponse, RegisterResponse, User, Organization } from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * AuthService handles authentication and user management API calls.
 */
class AuthService {
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
      return await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
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
      return await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }

  /**
   * Log out the current user.
   */
  async logout(): Promise<void> {
    try {
      return await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      throw new Error('Logout failed.');
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