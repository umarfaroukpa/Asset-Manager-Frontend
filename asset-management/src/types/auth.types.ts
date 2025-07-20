export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'org_admin' | 'staff';
  organizationId: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  subscriptionPlan: 'free' | 'basic' | 'premium';
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  updatedAt: string;
  staff?: User[];
}

export interface LoginResponse {
  token: string;
  user: User;
  organization: Organization;
}

export interface RegisterResponse {
  token: string;
  user: User;
  organization: Organization;
}