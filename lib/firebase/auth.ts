import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { auth } from "./config";
import { createOrUpdateUser } from "./users/userModel";
import { UserRole } from "./users/userSchema";

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Email/Password Sign In
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Update user's last login in Firestore
    await createOrUpdateUser(result.user);
    
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Email/Password Sign Up
export const signUpWithEmail = async (email: string, password: string, additionalData?: { name?: string; role?: UserRole }): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user record in Firestore
    await createOrUpdateUser(result.user, {
      displayName: additionalData?.name || "",
      role: additionalData?.role,
      fullName: additionalData?.name || ""
    });
    
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Google Sign In
export const signInWithGoogle = async (role?: UserRole): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create or update user record in Firestore
    await createOrUpdateUser(result.user, {
      role: role
    });
    
    return result.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign Out
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Export auth for use in other components
export { auth };

export default auth; 