export type DealType = "product" | "money" | "both";

export interface BrandReview {
  stars: 1 | 2 | 3 | 4 | 5;
  review: string;
  reviewerName?: string;
  reviewerEmail?: string;
  createdAt: Date;
}

export interface Brand {
  id: string;
  ownerId: string; // User ID who owns this brand
  name: string;
  logoUrl?: string;
  category: string;
  description: string;
  location: string;
  dealType: DealType;
  
  // Contact Information
  contact: {
    representative: string;
    email: string;
    phone?: string;
  };
  
  // Access & Pricing
  unlockContactPaid: boolean;
  
  // System fields
  verified: boolean;
  reviews: BrandReview[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateBrandData {
  ownerId: string;
  name: string;
  logoUrl?: string;
  category: string;
  description: string;
  location: string;
  dealType: DealType;
  contact: {
    representative: string;
    email: string;
    phone?: string;
  };
  unlockContactPaid: boolean;
}

export interface UpdateBrandData {
  name?: string;
  logoUrl?: string;
  category?: string;
  description?: string;
  location?: string;
  dealType?: DealType;
  contact?: Partial<Brand["contact"]>;
  unlockContactPaid?: boolean;
  verified?: boolean;
  reviews?: BrandReview[];
  isActive?: boolean;
  updatedAt: Date;
}

// Helper function to validate deal type
export function isValidDealType(dealType: any): dealType is DealType {
  return ["product", "money", "both"].includes(dealType);
}

// Helper function to create initial brand data
export function createInitialBrandData(data: CreateBrandData): Omit<Brand, "id"> {
  const now = new Date();
  
  return {
    ownerId: data.ownerId,
    name: data.name,
    logoUrl: data.logoUrl,
    category: data.category,
    description: data.description,
    location: data.location,
    dealType: data.dealType,
    contact: {
      representative: data.contact.representative,
      email: data.contact.email,
      phone: data.contact.phone || undefined
    },
    unlockContactPaid: data.unlockContactPaid,
    verified: false,
    reviews: [],
    createdAt: now,
    updatedAt: now,
    isActive: true
  };
}

// Helper function to validate brand data
export function validateBrandData(data: CreateBrandData): string[] {
  const errors: string[] = [];
  
  if (!data.name.trim()) errors.push("Brand name is required");
  if (!data.category.trim()) errors.push("Category is required");
  if (!data.description.trim()) errors.push("Description is required");
  if (!data.location.trim()) errors.push("Location is required");
  if (!isValidDealType(data.dealType)) errors.push("Valid deal type is required");
  if (!data.contact.representative.trim()) errors.push("Representative name is required");
  if (!data.contact.email.trim()) errors.push("Email is required");
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contact.email && !emailRegex.test(data.contact.email)) {
    errors.push("Valid email address is required");
  }
  
  return errors;
}
