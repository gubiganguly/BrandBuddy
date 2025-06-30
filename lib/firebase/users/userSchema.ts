export type UserRole = "event-planner" | "sponsor" | "both";

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
  createdAt: Date;
  updatedAt: Date;
  authProvider: "email" | "google";
  isEmailVerified: boolean;
  // Optional profile fields
  fullName?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  // Brand references
  brandIds?: string[]; // Array of brand IDs this user owns
  // Preferences
  preferences?: {
    notifications: boolean;
    marketingEmails: boolean;
    theme: "light" | "dark" | "auto";
  };
  // Metadata
  lastLoginAt?: Date;
  isActive: boolean;
  completedOnboarding: boolean;
}

export interface CreateUserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
  authProvider: "email" | "google";
  isEmailVerified: boolean;
  fullName?: string;
}

export interface UpdateUserData {
  displayName?: string;
  photoURL?: string;
  role?: UserRole;
  fullName?: string;
  company?: string;
  location?: string;
  bio?: string;
  website?: string;
  preferences?: Partial<User["preferences"]>;
  completedOnboarding?: boolean;
  lastLoginAt?: Date;
  isActive?: boolean;
  updatedAt: Date;
}

export const defaultUserPreferences: User["preferences"] = {
  notifications: true,
  marketingEmails: false,
  theme: "auto"
};

// Helper function to validate user role
export function isValidUserRole(role: any): role is UserRole {
  return ["event-planner", "sponsor", "both"].includes(role);
}

// Helper function to create initial user data
export function createInitialUserData(data: CreateUserData): Omit<User, "uid"> {
  const now = new Date();
  
  const userData: any = {
    email: data.email,
    displayName: data.displayName || "",
    photoURL: data.photoURL || "",
    createdAt: now,
    updatedAt: now,
    authProvider: data.authProvider,
    isEmailVerified: data.isEmailVerified,
    fullName: data.fullName || data.displayName || "",
    preferences: defaultUserPreferences,
    lastLoginAt: now,
    isActive: true,
    completedOnboarding: data.role ? true : false
  };
  
  // Only add role if it's defined
  if (data.role) {
    userData.role = data.role;
  }
  
  return userData;
}
