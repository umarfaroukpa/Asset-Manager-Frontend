import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth";

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

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export { auth };
export default { app, analytics };