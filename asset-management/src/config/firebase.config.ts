import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, getIdToken } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyzjBHJRXUCIUZK5s-XcTypje9adqESyw",
  authDomain: "asset-manager-fb9d3.firebaseapp.com",
  projectId: "asset-manager-fb9d3",
  storageBucket: "asset-manager-fb9d3.firebasestorage.app",
  messagingSenderId: "61212248438",
  appId: "1:61212248438:web:758ee01d1c1bd3c1649257",
  measurementId: "G-N5EMCN8T3R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Import User type
import { User, UserRole } from '../types/auth.types';

// Auth functions
export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Don't store token in localStorage here - Firebase handles it
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error.code, error.message);
    switch (error.code) {
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password. Please try again.');
      case 'auth/user-disabled':
        throw new Error('This account has been disabled.');
      case 'auth/user-not-found':
        throw new Error('No account found with this email.');
      case 'auth/wrong-password':
        throw new Error('Invalid email or password. Please try again.');
      case 'auth/invalid-email':
        throw new Error('Invalid email address.');
      case 'auth/too-many-requests':
        throw new Error('Too many failed attempts. Please try again later.');
      default:
        throw new Error('An error occurred during login. Please try again later.');
    }
  }
};

export const registerUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    // Create the user account first
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document in Firestore with better error handling
    try {
      const userDoc = doc(db, 'users', user.uid);
      const userData = {
        firstName: 'Unknown',
        lastName: '',
        email: email,
        role: 'user' as UserRole, // Changed from 'employee' to match your UserRole type
        organizationId: '', // Add required organizationId field
        permissions: [], // Add required permissions array
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: null,
        department: '',
        phone: '',
        name: '',
      };
      
      await setDoc(userDoc, userData);
      console.log('User document created successfully');
    } catch (firestoreError: any) {
      console.error('Firestore error while creating user document:', firestoreError);
      // Don't throw here - user account is already created
    }
    
    return user;
  } catch (error: any) {
    console.error('Register error:', error.code, error.message);
    
    // Handle specific Firebase Auth errors
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
        throw new Error('Failed to register user. Please try again.');
    }
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    // Remove any stored tokens
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Updated getCurrentToken function
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      // Force refresh to get a fresh token
      const token = await getIdToken(user, true);
      console.log('Firebase token retrieved successfully');
      return token;
    } else {
      console.log('No current user found');
      return null;
    }
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};

export const fetchUserProfile = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      unsubscribe(); // Unsubscribe immediately to avoid memory leaks
      
      if (user) {
        try {
          const userProfile: User = {
            id: user.uid,
            firstName: user.displayName ? user.displayName.split(' ')[0] || 'Unknown' : 'Unknown',
            lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
            email: user.email || 'N/A',
            role: 'user' as UserRole, // Changed from 'employee' to match your UserRole type
            organizationId: '', // Add required organizationId field
            permissions: [], // Add required permissions array
            isActive: true,
            createdAt: user.metadata.creationTime || new Date().toISOString(),
            updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
            lastLogin: user.metadata.lastSignInTime || '', // Provide empty string fallback
            department: '',
            phone: '',
            name: user.displayName || '',
          };

          // Fetch from Firestore with error handling
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              userProfile.firstName = data.firstName || userProfile.firstName;
              userProfile.lastName = data.lastName || userProfile.lastName;
              userProfile.email = data.email || userProfile.email;
              userProfile.role = (data.role as UserRole) || userProfile.role;
              userProfile.isActive = data.isActive ?? userProfile.isActive;
              userProfile.createdAt = data.createdAt?.toDate?.()?.toISOString() || userProfile.createdAt;
              userProfile.updatedAt = data.updatedAt?.toDate?.()?.toISOString() || userProfile.updatedAt;
              userProfile.lastLogin = data.lastLogin || userProfile.lastLogin;
              userProfile.organizationId = data.organizationId || userProfile.organizationId;
              userProfile.permissions = data.permissions || userProfile.permissions;
              userProfile.department = data.department || userProfile.department;
              userProfile.phone = data.phone || userProfile.phone;
              userProfile.name = data.name || userProfile.name;
            }
          } catch (firestoreError) {
            console.error('Error fetching user document from Firestore:', firestoreError);
            // Continue with the profile from Auth data
          }

          resolve(userProfile);
        } catch (error) {
          console.error('Fetch profile error:', error);
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication state check timed out'));
    }, 10000);
  });
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Helper function to check if Firestore is accessible
export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try to read a dummy document to test connection
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};