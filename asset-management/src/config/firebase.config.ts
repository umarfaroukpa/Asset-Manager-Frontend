import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut, 
  User, 
  UserCredential 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyzjBHJRXUCIUZK5s-XcTypje9adqESyw",
  authDomain: "asset-manager-fb9d3.firebaseapp.com",
  projectId: "asset-manager-fb9d3",
  storageBucket: "asset-manager-fb9d3.firebasestorage.app",
  messagingSenderId: "61212248438",
  appId: "1:61212248438:web:758ee01d1c1bd3c1649257",
  measurementId: "G-N5EMCN8T3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Authentication functions with proper types
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

//getCurrentToken function
export const getCurrentToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Get the ID token for the current user
      const token = await currentUser.getIdToken();
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting current token:', error);
    return null;
  }
};

// Alternative function to get token with force refresh option
export const getCurrentTokenWithRefresh = async (forceRefresh: boolean = false): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken(forceRefresh);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error getting current token with refresh:', error);
    return null;
  }
};

export { auth };
export default { app, analytics };