import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, getIdToken } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserRole } from '../types/auth.types';
import { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCyzjBHJRXUCIUZK5s-XcTypje9adqESyw",
  authDomain: "asset-manager-fb9d3.firebaseapp.com",
  projectId: "asset-manager-fb9d3",
  storageBucket: "asset-manager-fb9d3.firebasestorage.app",
  messagingSenderId: "61212248438",
  appId: "1:61212248438:web:758ee01d1c1bd3c1649257",
  measurementId: "G-N5EMCN8T3R",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
export { db };

// Connect to emulator in development
if (process.env.NODE_ENV === 'development') {
  import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
    connectFirestoreEmulator(db, 'localhost', 3000);
    console.log('Connected to Firestore emulator');
  });
}

export const loginUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    console.log('Attempting login with email:', email);
    console.log('Firebase config project ID:', firebaseConfig.projectId);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Login successful for user:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.customData);
    
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
        console.error('Unhandled auth error:', error.code, error.message);
        throw new Error('An error occurred during login. Please try again later.');
    }
  }
};

export const registerUser = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    try {
      const userDoc = doc(db, 'users', user.uid);
      const userData = {
        firstName: 'Unknown',
        lastName: '',
        email: email,
        role: 'user' as UserRole,
        organizationId: '',
        permissions: [],
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: null,
        department: '',
        phone: '',
        name: '',
      };
      console.log('Writing user data:', userData);
      await setDoc(userDoc, userData);
      console.log('User document created successfully');
    } catch (firestoreError: any) {
      console.error('Firestore error while creating user document:', firestoreError);
    }

    return user;
  } catch (error: any) {
    console.error('Register error:', error.code, error.message);
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
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentToken = async (): Promise<string | null> => {
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await getIdToken(user, true);
      console.log('Firebase token retrieved successfully');
      return token;
    }
    console.log('No current user found');
    return null;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return null;
  }
};

export const fetchUserProfile = async (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      unsubscribe();
      if (user) {
        try {
          const userProfile: User = {
            id: user.uid,
            firstName: user.displayName ? user.displayName.split(' ')[0] || 'Unknown' : 'Unknown',
            lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
            email: user.email || 'N/A',
            role: 'user' as UserRole,
            organizationId: '',
            permissions: [],
            isActive: true,
            createdAt: user.metadata.creationTime || new Date().toISOString(),
            updatedAt: user.metadata.lastSignInTime || new Date().toISOString(),
            lastLogin: user.metadata.lastSignInTime || '',
            department: '',
            phone: '',
            name: user.displayName || '',
          };

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

    setTimeout(() => {
      unsubscribe();
      reject(new Error('Authentication state check timed out'));
    }, 10000);
  });
};

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};