import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "../config";
import { User, CreateUserData, UpdateUserData, createInitialUserData, UserRole } from "./userSchema";

const USERS_COLLECTION = "users";

// Helper function to convert Firestore timestamps to Date objects
function convertTimestamps(data: any): any {
  const converted = { ...data };
  
  if (converted.createdAt && converted.createdAt.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt && converted.updatedAt.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  if (converted.lastLoginAt && converted.lastLoginAt.toDate) {
    converted.lastLoginAt = converted.lastLoginAt.toDate();
  }
  
  return converted;
}

// Helper function to convert Date objects to Firestore timestamps
function convertToTimestamps(data: any): any {
  const converted = { ...data };
  
  if (converted.createdAt instanceof Date) {
    converted.createdAt = Timestamp.fromDate(converted.createdAt);
  }
  if (converted.updatedAt instanceof Date) {
    converted.updatedAt = Timestamp.fromDate(converted.updatedAt);
  }
  if (converted.lastLoginAt instanceof Date) {
    converted.lastLoginAt = Timestamp.fromDate(converted.lastLoginAt);
  }
  
  return converted;
}

// Helper function to remove undefined values from an object
function removeUndefinedValues(obj: any): any {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

// Create a new user in Firestore
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userData.uid);
    
    // Check if user already exists
    const existingUser = await getDoc(userDocRef);
    if (existingUser.exists()) {
      throw new Error("User already exists");
    }
    
    const initialData = createInitialUserData(userData);
    const cleanedData = removeUndefinedValues(initialData);
    const firestoreData = convertToTimestamps(cleanedData);
    
    await setDoc(userDocRef, firestoreData);
    
    return {
      uid: userData.uid,
      ...initialData
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

// Get user by UID
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data();
    return convertTimestamps({
      uid: userDoc.id,
      ...userData
    }) as User;
  } catch (error: any) {
    console.error("Error getting user:", error);
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    return convertTimestamps({
      uid: userDoc.id,
      ...userData
    }) as User;
  } catch (error: any) {
    console.error("Error getting user by email:", error);
    throw new Error(`Failed to get user by email: ${error.message}`);
  }
}

// Update user data
export async function updateUser(uid: string, updateData: Partial<UpdateUserData>): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    
    // Add updated timestamp
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Remove undefined values before updating
    const cleanedData = removeUndefinedValues(dataWithTimestamp);
    const firestoreData = convertToTimestamps(cleanedData);
    
    // Only update if there's data to update
    if (Object.keys(cleanedData).length > 0) {
      await updateDoc(userDocRef, firestoreData);
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

// Update user role
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  try {
    await updateUser(uid, {
      role,
      completedOnboarding: true,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw new Error(`Failed to update user role: ${error.message}`);
  }
}

// Update last login time
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    await updateUser(uid, {
      lastLoginAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error updating last login:", error);
    throw new Error(`Failed to update last login: ${error.message}`);
  }
}

// Create or update user (upsert operation)
export async function createOrUpdateUser(firebaseUser: FirebaseUser, additionalData?: Partial<CreateUserData>): Promise<User> {
  try {
    // Check if user exists
    let existingUser = await getUserById(firebaseUser.uid);
    
    if (existingUser) {
      // Update last login and return existing user
      await updateLastLogin(firebaseUser.uid);
      return existingUser;
    }
    
    // Create new user
    const isGoogleAuth = firebaseUser.providerData[0]?.providerId.includes("google");
    const createData: CreateUserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || "",
      photoURL: firebaseUser.photoURL || "",
      authProvider: isGoogleAuth ? "google" : "email",
      isEmailVerified: firebaseUser.emailVerified,
      // For Google auth, use displayName as fullName if not provided in additionalData
      fullName: additionalData?.fullName || (isGoogleAuth ? firebaseUser.displayName || "" : "")
    };
    
    // Only add role if it's provided and not undefined
    if (additionalData?.role) {
      createData.role = additionalData.role;
    }
    
    return await createUser(createData);
  } catch (error: any) {
    console.error("Error creating or updating user:", error);
    throw new Error(`Failed to create or update user: ${error.message}`);
  }
}

// Check if user needs to complete onboarding (set role)
export async function userNeedsOnboarding(uid: string): Promise<boolean> {
  try {
    const user = await getUserById(uid);
    return user ? !user.completedOnboarding || !user.role : false;
  } catch (error: any) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
}

// Get users by role
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where("role", "==", role), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => convertTimestamps({
      uid: doc.id,
      ...doc.data()
    }) as User);
  } catch (error: any) {
    console.error("Error getting users by role:", error);
    throw new Error(`Failed to get users by role: ${error.message}`);
  }
}

// Delete user (soft delete by setting isActive to false)
export async function deactivateUser(uid: string): Promise<void> {
  try {
    await updateUser(uid, {
      isActive: false,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    throw new Error(`Failed to deactivate user: ${error.message}`);
  }
}
