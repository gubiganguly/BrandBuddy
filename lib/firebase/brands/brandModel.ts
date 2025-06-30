import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, Timestamp, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../config";
import { storage } from "../config";
import { Brand, CreateBrandData, UpdateBrandData, createInitialBrandData, validateBrandData } from "./brandSchema";

const BRANDS_COLLECTION = "brands";

// Helper function to convert Firestore timestamps to Date objects
function convertTimestamps(data: any): any {
  const converted = { ...data };
  
  if (converted.createdAt && converted.createdAt.toDate) {
    converted.createdAt = converted.createdAt.toDate();
  }
  if (converted.updatedAt && converted.updatedAt.toDate) {
    converted.updatedAt = converted.updatedAt.toDate();
  }
  if (converted.reviews && Array.isArray(converted.reviews)) {
    converted.reviews = converted.reviews.map((review: any) => ({
      ...review,
      createdAt: review.createdAt?.toDate ? review.createdAt.toDate() : review.createdAt
    }));
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
  if (converted.reviews && Array.isArray(converted.reviews)) {
    converted.reviews = converted.reviews.map((review: any) => ({
      ...review,
      createdAt: review.createdAt instanceof Date ? Timestamp.fromDate(review.createdAt) : review.createdAt
    }));
  }
  
  return converted;
}

// Helper function to remove undefined values from an object
function removeUndefinedValues(obj: any): any {
  const cleaned: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
        const cleanedNested = removeUndefinedValues(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
}

// Upload logo to Firebase Storage
export async function uploadBrandLogo(file: File, brandId: string): Promise<string> {
  try {
    const storageRef = ref(storage, `brands/${brandId}/logo`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    console.error("Error uploading brand logo:", error);
    throw new Error(`Failed to upload logo: ${error.message}`);
  }
}

// Delete logo from Firebase Storage
export async function deleteBrandLogo(brandId: string): Promise<void> {
  try {
    const storageRef = ref(storage, `brands/${brandId}/logo`);
    await deleteObject(storageRef);
  } catch (error: any) {
    // Don't throw error if file doesn't exist
    if (!error.code?.includes('object-not-found')) {
      console.error("Error deleting brand logo:", error);
    }
  }
}

// Create a new brand
export async function createBrand(brandData: CreateBrandData, logoFile?: File): Promise<Brand> {
  try {
    // Validate brand data
    const validationErrors = validateBrandData(brandData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Create brand document reference to get ID
    const brandRef = doc(collection(db, BRANDS_COLLECTION));
    const brandId = brandRef.id;

    // Upload logo if provided
    let logoUrl: string | undefined;
    if (logoFile) {
      logoUrl = await uploadBrandLogo(logoFile, brandId);
    }

    // Prepare brand data
    const initialData = createInitialBrandData({
      ...brandData,
      logoUrl
    });
    
    const cleanedData = removeUndefinedValues(initialData);
    const firestoreData = convertToTimestamps(cleanedData);
    
    // Save to Firestore
    await setDoc(brandRef, firestoreData);
    
    return {
      id: brandId,
      ...initialData
    };
  } catch (error: any) {
    console.error("Error creating brand:", error);
    throw new Error(`Failed to create brand: ${error.message}`);
  }
}

// Get brand by ID
export async function getBrandById(brandId: string): Promise<Brand | null> {
  try {
    const brandRef = doc(db, BRANDS_COLLECTION, brandId);
    const brandDoc = await getDoc(brandRef);
    
    if (!brandDoc.exists()) {
      return null;
    }
    
    const brandData = brandDoc.data();
    return convertTimestamps({
      id: brandDoc.id,
      ...brandData
    }) as Brand;
  } catch (error: any) {
    console.error("Error getting brand:", error);
    throw new Error(`Failed to get brand: ${error.message}`);
  }
}

// Get brands by owner ID
export async function getBrandsByOwner(ownerId: string): Promise<Brand[]> {
  try {
    const brandsRef = collection(db, BRANDS_COLLECTION);
    const q = query(brandsRef, where("ownerId", "==", ownerId), where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => convertTimestamps({
      id: doc.id,
      ...doc.data()
    }) as Brand);
  } catch (error: any) {
    console.error("Error getting brands by owner:", error);
    throw new Error(`Failed to get brands: ${error.message}`);
  }
}

// Get all active brands
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const brandsRef = collection(db, BRANDS_COLLECTION);
    const q = query(brandsRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => convertTimestamps({
      id: doc.id,
      ...doc.data()
    }) as Brand);
  } catch (error: any) {
    console.error("Error getting all brands:", error);
    throw new Error(`Failed to get brands: ${error.message}`);
  }
}

// Get brands by category
export async function getBrandsByCategory(category: string): Promise<Brand[]> {
  try {
    const brandsRef = collection(db, BRANDS_COLLECTION);
    const q = query(
      brandsRef, 
      where("category", "==", category),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => convertTimestamps({
      id: doc.id,
      ...doc.data()
    }) as Brand);
  } catch (error: any) {
    console.error("Error getting brands by category:", error);
    throw new Error(`Failed to get brands by category: ${error.message}`);
  }
}

// Update brand
export async function updateBrand(brandId: string, updateData: Partial<UpdateBrandData>, logoFile?: File): Promise<void> {
  try {
    const brandRef = doc(db, BRANDS_COLLECTION, brandId);
    
    // Upload new logo if provided
    if (logoFile) {
      // Delete old logo first
      await deleteBrandLogo(brandId);
      // Upload new logo
      const logoUrl = await uploadBrandLogo(logoFile, brandId);
      updateData.logoUrl = logoUrl;
    }
    
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
      await updateDoc(brandRef, firestoreData);
    }
  } catch (error: any) {
    console.error("Error updating brand:", error);
    throw new Error(`Failed to update brand: ${error.message}`);
  }
}

// Soft delete brand (set isActive to false)
export async function deactivateBrand(brandId: string): Promise<void> {
  try {
    await updateBrand(brandId, {
      isActive: false,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error deactivating brand:", error);
    throw new Error(`Failed to deactivate brand: ${error.message}`);
  }
}

// Add review to brand
export async function addBrandReview(
  brandId: string, 
  stars: 1 | 2 | 3 | 4 | 5, 
  review: string,
  reviewerName?: string,
  reviewerEmail?: string
): Promise<void> {
  try {
    const brand = await getBrandById(brandId);
    if (!brand) {
      throw new Error("Brand not found");
    }

    const newReview = {
      stars,
      review,
      reviewerName,
      reviewerEmail,
      createdAt: new Date()
    };

    const updatedReviews = [...brand.reviews, newReview];
    
    await updateBrand(brandId, {
      reviews: updatedReviews,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error adding brand review:", error);
    throw new Error(`Failed to add review: ${error.message}`);
  }
}

// Verify brand (admin function)
export async function verifyBrand(brandId: string): Promise<void> {
  try {
    await updateBrand(brandId, {
      verified: true,
      updatedAt: new Date()
    });
  } catch (error: any) {
    console.error("Error verifying brand:", error);
    throw new Error(`Failed to verify brand: ${error.message}`);
  }
}
