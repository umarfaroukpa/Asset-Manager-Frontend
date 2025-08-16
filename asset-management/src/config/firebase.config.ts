import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged,  User as FirebaseUser, getIdToken, updateProfile } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import { AppUser, UserRole } from '../types/auth.types';
import { logAuth, logError, logFirebase } from '../utils/logger';

const firebaseConfig = {
  apiKey: "AIzaSyCyzjBHJRXUCIUZK5s-XcTypje9adqESyw",
  authDomain: "asset-manager-fb9d3.firebaseapp.com",
  projectId: "asset-manager-fb9d3",
  storageBucket: "asset-manager-fb9d3.firebasestorage.app",
  messagingSenderId: "61212248438",
  appId: "1:61212248438:web:758ee01d1c1bd3c1649257",
  measurementId: "G-N5EMCN8T3R",
};

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

logFirebase('Firebase initialized', { projectId: firebaseConfig.projectId });

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = await getCurrentToken(true);
  
  return fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });
};

// Add this function to fetch user role from your backend API
export const fetchUserRole = async (uid: string): Promise<UserRole> => {
  try {
    console.log('🔍 Fetching user role from backend for UID:', uid);
    
    const response = await makeAuthenticatedRequest(`/users/${uid}/role`);
    
    if (!response.ok) {
      console.warn('⚠️ Failed to fetch user role, using default');
      return 'user';
    }
    
    const data = await response.json();
    const role = data.role || 'user';
    
    console.log('✅ User role fetched from backend:', role);
    return role;
  } catch (error) {
    console.error('❌ Error fetching user role from backend:', error);
    return 'user'; // Default fallback
  }
};

// Add this function to fetch full user profile from backend
export const fetchUserProfileFromAPI = async (): Promise<AppUser | null> => {
  try {
    console.log('🔍 Fetching full user profile from backend API');
    
    const response = await makeAuthenticatedRequest('/users/me');
    
    if (!response.ok) {
      console.error('❌ Failed to fetch user profile from API:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data?.user) {
      console.error('❌ Invalid user profile data from API');
      return null;
    }
    
    const backendUser = data.data.user;
    
    // Transform backend user data to AppUser format
    const userProfile: AppUser = {
      id: backendUser._id || backendUser.id,
      firstName: backendUser.name ? backendUser.name.split(' ')[0] || 'Unknown' : 'Unknown',
      lastName: backendUser.name ? backendUser.name.split(' ').slice(1).join(' ') || '' : '',
      email: backendUser.email || '',
      role: backendUser.role || 'user',
      organizationId: backendUser.organization?._id || backendUser.organizationId || '',
      permissions: backendUser.permissions || [],
      isActive: backendUser.status === 'active',
      createdAt: backendUser.createdAt || new Date().toISOString(),
      updatedAt: backendUser.updatedAt || new Date().toISOString(),
      lastLogin: backendUser.lastLogin || '',
      department: backendUser.department || '',
      phone: backendUser.phone || '',
      name: backendUser.name || backendUser.email?.split('@')[0] || 'Unknown',
      displayName: backendUser.name || backendUser.displayName,
    };
    
    console.log('✅ User profile fetched from backend:', {
      id: userProfile.id,
      email: userProfile.email,
      name: userProfile.name,
      role: userProfile.role
    });
    
    return userProfile;
  } catch (error) {
    console.error('❌ Error fetching user profile from API:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    logAuth('Attempting login', { email });
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    logAuth('Login successful', { 
      userId: user.uid, 
      emailVerified: user.emailVerified 
    });
    
    // Get token for API authentication
    try {
      const token = await getIdToken(user, true);
      logAuth('Authentication token generated successfully');
    } catch (tokenError) {
      logError('Error getting authentication token', tokenError);
    }
    
    return user;
  } catch (error: any) {
    logError('Login failed', {
      code: error.code,
      message: error.message
    });
    
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        throw new Error('Invalid email or password. Please try again.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        throw new Error('Network error. Please check your connection and try again.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password sign-in is not enabled.');
      default:
        logError('Unhandled auth error', { code: error.code, message: error.message });
        throw new Error(`Authentication failed: ${error.message}`);
    }
  }
};

export const registerUser = async (email: string, password: string, displayName?: string): Promise<FirebaseUser> => {
  try {
    logAuth('Attempting registration', { email });
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    logAuth('Registration successful', { userId: user.uid });
    
    // Update display name if provided
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
        logAuth('Display name updated', { displayName });
      } catch (profileError) {
        logError('Failed to update display name', profileError);
      }
    }
    
    return user;
  } catch (error: any) {
    logError('Registration failed', {
      code: error.code,
      message: error.message
    });
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('An account with this email already exists.');
      case 'auth/weak-password':
        throw new Error('Password should be at least 6 characters long.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled.');
      default:
        throw new Error(`Registration failed: ${error.message}`);
    }
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    logAuth('Logging out user');
    
    await signOut(auth);
    
    // Clear any stored tokens
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    
    logAuth('User logged out successfully');
  } catch (error) {
    logError('Logout failed', error);
    throw new Error('Failed to log out. Please try again.');
  }
};

export const getCurrentToken = async (forceRefresh: boolean = false): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      logAuth('No authenticated user found for token retrieval');
      return null;
    }
    
    logAuth('Getting Firebase authentication token', { 
      userId: user.uid, 
      forceRefresh 
    });
    
    const token = await getIdToken(user, forceRefresh);
    
    logAuth('Firebase token retrieved successfully');
    
    return token;
  } catch (error) {
    logError('Failed to get Firebase token', error);
    throw new Error('Failed to get authentication token');
  }
};

// Updated fetchUserProfile function that uses backend API
export const fetchUserProfile = async (): Promise<AppUser | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      unsubscribe();
      
      if (!user) {
        console.log('❌ No authenticated user found');
        resolve(null);
        return;
      }
      
      try {
        console.log('👤 Fetching user profile for Firebase user:', user.uid);
        
        // Try to fetch from backend API first
        const backendProfile = await fetchUserProfileFromAPI();
        
        if (backendProfile) {
          resolve(backendProfile);
          return;
        }
        
        // Fallback to Firebase user data with role from backend
        console.log('⚠️ Falling back to Firebase user data');
        
        const actualRole = await fetchUserRole(user.uid);
        
        const userProfile: AppUser = {
          id: user.uid,
          firstName: user.displayName ? user.displayName.split(' ')[0] || 'Unknown' : 'Unknown',
          lastName: user.displayName ? user.displayName.split(' ').slice(1).join(' ') || '' : '',
          email: user.email || '',
          role: actualRole,
          organizationId: '',
          permissions: [],
          isActive: true,
          createdAt: user.metadata.creationTime || new Date().toISOString(),
          updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
          lastLogin: user.metadata.lastSignInTime || '',
          department: '',
          phone: '',
          name: user.displayName || user.email?.split('@')[0] || 'Unknown',
          displayName: user.displayName || undefined,
        };
        
        console.log('✅ User profile created from Firebase:', {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: userProfile.role
        });
        
        resolve(userProfile);
      } catch (error) {
        console.error('❌ Error creating user profile:', error);
        reject(new Error('Failed to create user profile'));
      }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication state check timed out'));
    }, 10000);
  });
};

// Enhanced auth state change handler
export const onAuthStateChange = (callback: (user: AppUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        console.log('🔄 Auth state changed - user signed in:', firebaseUser.uid);
        
        // Try to fetch from backend API first
        const backendProfile = await fetchUserProfileFromAPI();
        
        if (backendProfile) {
          console.log('✅ Using backend profile data');
          callback(backendProfile);
          return;
        }
        
        // Fallback to Firebase + role from backend
        console.log('⚠️ Using Firebase data with backend role');
        const actualRole = await fetchUserRole(firebaseUser.uid);
        
        const user: AppUser = {
          id: firebaseUser.uid,
          firstName: firebaseUser.displayName ? firebaseUser.displayName.split(' ')[0] || 'Unknown' : 'Unknown',
          lastName: firebaseUser.displayName ? firebaseUser.displayName.split(' ').slice(1).join(' ') || '' : '',
          email: firebaseUser.email || '',
          role: actualRole,
          organizationId: '',
          permissions: [],
          isActive: true,
          createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
          updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
          lastLogin: firebaseUser.metadata.lastSignInTime || '',
          department: '',
          phone: '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
          displayName: firebaseUser.displayName || undefined,
        };
        
        console.log('✅ Auth state changed - role resolved:', {
          uid: user.id,
          role: user.role,
          email: user.email
        });
        
        callback(user);
      } catch (error) {
        console.error('❌ Error in auth state change:', error);
        callback(null);
      }
    } else {
      console.log('🔄 Auth state changed - user signed out');
      callback(null);
    }
  });
};

// Wait for authentication to be ready
export const waitForAuth = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Force refresh the current user's token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No user to refresh token for');
      return null;
    }
    
    console.log('🔄 Force refreshing Firebase token...');
    const token = await getIdToken(user, true);
    console.log('✅ Token refreshed successfully');
    return token;
  } catch (error) {
    console.error('❌ Error refreshing token:', error);
    throw new Error('Failed to refresh authentication token');
  }
};

// Debug function to analyze tokens
export const debugToken = async (): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('❌ No user signed in for token debug');
      return;
    }

    const token = await getIdToken(user, true);
    console.log('=== 🔍 TOKEN DEBUG INFO ===');
    console.log('User UID:', user.uid);
    console.log('User Email:', user.email);
    console.log('Token Length:', token.length);
    
    // Parse token to check structure
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        console.log('Token Header:', header);
        console.log('Token Payload (selected fields):', {
          iss: payload.iss,
          aud: payload.aud,
          auth_time: payload.auth_time,
          user_id: payload.user_id,
          firebase: payload.firebase,
          exp: payload.exp,
          iat: payload.iat,
          email: payload.email,
          email_verified: payload.email_verified
        });
        
        // Check token validity
        const now = Math.floor(Date.now() / 1000);
        const timeToExpiry = payload.exp - now;
        console.log('Token valid for:', Math.floor(timeToExpiry / 60), 'minutes');
      }
    } catch (parseError) {
      console.error('❌ Error parsing token:', parseError);
    }
    console.log('=== END TOKEN DEBUG ===');
  } catch (error) {
    console.error('❌ Token debug error:', error);
  }
};

// Get current user info
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!auth.currentUser;
};

// Export auth instance for direct use if needed
export { auth as firebaseAuth };