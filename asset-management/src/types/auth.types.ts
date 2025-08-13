export type UserRole = 'user' | 'admin' | 'owner' |'manager';
export type SubscriptionPlan = 'free' | 'basic' | 'premium';

export interface AppUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string; // Adding displayName as optional field
  lastLogin: string;
  role: UserRole;
  organizationId: string;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  department: string;
  phone: string;
  name: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  subscriptionPlan: SubscriptionPlan;
  maxUsers: number;
  currentUsers: number;
  createdAt: string;
  updatedAt: string;
  staff?: AppUser[];
}

export interface LoginResponse {
  token: string;
  user: AppUser;
  organization: Organization;
}

export interface RegisterResponse {
  token: string;
  user: AppUser;
  organization: Organization;
}