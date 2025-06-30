"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { 
  User, 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Building, 
  Crown, 
  Mail,
  MapPin,
  FileText,
  Settings,
  Bell,
  Save,
  ChevronsUpDown,
  Upload,
  X,
  Phone,
  DollarSign,
  Tag,
  Package,
  Coins,
  Zap,
  Eye,
  EyeOff,
  Star,
  Shield,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getUserById, updateUser } from "@/lib/firebase/users/userModel";
import { User as UserData, UserRole } from "@/lib/firebase/users/userSchema";
import { createBrand, getBrandsByOwner } from "@/lib/firebase/brands/brandModel";
import { DealType, Brand } from "@/lib/firebase/brands/brandSchema";

// US Cities data
const usCities = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ",
  "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA",
  "Austin, TX", "Jacksonville, FL", "Fort Worth, TX", "Columbus, OH", "Charlotte, NC",
  "San Francisco, CA", "Indianapolis, IN", "Seattle, WA", "Denver, CO", "Washington, DC",
  "Boston, MA", "El Paso, TX", "Nashville, TN", "Detroit, MI", "Oklahoma City, OK",
  "Portland, OR", "Las Vegas, NV", "Memphis, TN", "Louisville, KY", "Baltimore, MD",
  "Milwaukee, WI", "Albuquerque, NM", "Tucson, AZ", "Fresno, CA", "Sacramento, CA",
  "Kansas City, MO", "Mesa, AZ", "Atlanta, GA", "Omaha, NE", "Colorado Springs, CO",
  "Raleigh, NC", "Miami, FL", "Oakland, CA", "Minneapolis, MN", "Tulsa, OK",
  "Cleveland, OH", "Wichita, KS", "Arlington, TX", "New Orleans, LA", "Bakersfield, CA",
  "Tampa, FL", "Honolulu, HI", "Aurora, CO", "Anaheim, CA", "Santa Ana, CA",
  "St. Louis, MO", "Riverside, CA", "Corpus Christi, TX", "Lexington, KY", "Pittsburgh, PA",
  "Anchorage, AK", "Stockton, CA", "Cincinnati, OH", "St. Paul, MN", "Toledo, OH",
  "Greensboro, NC", "Newark, NJ", "Plano, TX", "Henderson, NV", "Lincoln, NE",
  "Buffalo, NY", "Jersey City, NJ", "Chula Vista, CA", "Fort Wayne, IN", "Orlando, FL",
  "St. Petersburg, FL", "Chandler, AZ", "Laredo, TX", "Norfolk, VA", "Durham, NC",
  "Madison, WI", "Lubbock, TX", "Irvine, CA", "Winston-Salem, NC", "Glendale, AZ",
  "Garland, TX", "Hialeah, FL", "Reno, NV", "Chesapeake, VA", "Gilbert, AZ",
  "Baton Rouge, LA", "Irving, TX", "Scottsdale, AZ", "North Las Vegas, NV", "Fremont, CA",
  "Boise, ID", "Richmond, VA", "San Bernardino, CA", "Birmingham, AL", "Spokane, WA",
  "Rochester, NY", "Des Moines, IA", "Modesto, CA", "Fayetteville, NC", "Tacoma, WA",
  "Oxnard, CA", "Fontana, CA", "Columbus, GA", "Montgomery, AL", "Moreno Valley, CA",
  "Shreveport, LA", "Aurora, IL", "Yonkers, NY", "Akron, OH", "Huntington Beach, CA",
  "Little Rock, AR", "Augusta, GA", "Amarillo, TX", "Glendale, CA", "Mobile, AL",
  "Grand Rapids, MI", "Salt Lake City, UT", "Tallahassee, FL", "Huntsville, AL", "Grand Prairie, TX",
  "Knoxville, TN", "Worcester, MA", "Newport News, VA", "Brownsville, TX", "Overland Park, KS",
  "Santa Clarita, CA", "Providence, RI", "Garden Grove, CA", "Chattanooga, TN", "Oceanside, CA",
  "Jackson, MS", "Fort Lauderdale, FL", "Santa Rosa, CA", "Rancho Cucamonga, CA", "Port St. Lucie, FL",
  "Tempe, AZ", "Ontario, CA", "Vancouver, WA", "Cape Coral, FL", "Sioux Falls, SD",
  "Springfield, MO", "Peoria, AZ", "Pembroke Pines, FL", "Elk Grove, CA", "Salem, OR",
  "Lancaster, CA", "Corona, CA", "Eugene, OR", "Palmdale, CA", "Salinas, CA",
  "Springfield, MA", "Pasadena, CA", "Fort Collins, CO", "Hayward, CA", "Pomona, CA",
  "Cary, NC", "Rockford, IL", "Alexandria, VA", "Escondido, CA", "McKinney, TX",
  "Kansas City, KS", "Joliet, IL", "Sunnyvale, CA", "Torrance, CA", "Bridgeport, CT",
  "Lakewood, CO", "Hollywood, FL", "Paterson, NJ", "Naperville, IL", "Syracuse, NY",
  "Mesquite, TX", "Dayton, OH", "Savannah, GA", "Clarksville, TN", "Orange, CA",
  "Pasadena, TX", "Fullerton, CA", "Killeen, TX", "Frisco, TX", "Hampton, VA",
  "McAllen, TX", "Warren, MI", "Bellevue, WA", "West Valley City, UT", "Columbia, MO"
];

// Brand categories
const brandCategories = [
  "Technology", "Food & Beverage", "Fashion & Apparel", "Sports & Fitness", "Healthcare",
  "Automotive", "Finance & Banking", "Real Estate", "Entertainment", "Education",
  "Travel & Tourism", "Beauty & Cosmetics", "Home & Garden", "Electronics", "Music",
  "Art & Design", "Non-Profit", "Media & Publishing", "Construction", "Retail",
  "Professional Services", "Manufacturing", "Agriculture", "Energy", "Telecommunications"
];

// Deal type options
const dealTypeOptions = [
  {
    value: "product" as const,
    label: "Product Sponsorship",
    icon: Package,
    description: "Provide products, services, or merchandise"
  },
  {
    value: "money" as const,
    label: "Financial Sponsorship",
    icon: DollarSign,
    description: "Provide monetary funding or cash support"
  },
  {
    value: "both" as const,
    label: "Hybrid Sponsorship",
    icon: Zap,
    description: "Flexible combination of products and money"
  }
];

// Simple markdown parser
const parseMarkdown = (text: string): string => {
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-yellow-400 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-yellow-400 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-yellow-400 mb-4">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Lists
    .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">• $1</li>')
    // Line breaks
    .replace(/\n/g, '<br />');
};

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  
  // Location dropdown state
  const [locationOpen, setLocationOpen] = useState(false);
  
  // Add Brand modal state
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [brandCategory, setBrandCategory] = useState("");
  const [brandLocation, setBrandLocation] = useState("");
  const [brandDealType, setBrandDealType] = useState<"product" | "money" | "both" | "">("");
  const [brandDescription, setBrandDescription] = useState("");
  const [contactRepresentative, setContactRepresentative] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [unlockContactPaid, setUnlockContactPaid] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [brandLocationOpen, setBrandLocationOpen] = useState(false);
  const [savingBrand, setSavingBrand] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  
  // User brands state
  const [userBrands, setUserBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  
  // Fetch user's brands
  const fetchUserBrands = async (userId: string) => {
    try {
      setLoadingBrands(true);
      const brands = await getBrandsByOwner(userId);
      setUserBrands(brands);
    } catch (error) {
      console.error("Error fetching user brands:", error);
    } finally {
      setLoadingBrands(false);
    }
  };
  
  // Calculate average rating for a brand
  const calculateAverageRating = (reviews: Brand['reviews']): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
    return Number((sum / reviews.length).toFixed(1));
  };
  
  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const userDoc = await getUserById(user.uid);
          if (userDoc) {
            setUserData(userDoc);
            // Populate form fields
            setFullName(userDoc.fullName || "");
            setRole(userDoc.role || "");
            setLocation(userDoc.location || "");
            setBio(userDoc.bio || "");
            if (userDoc.preferences) {
              setNotifications(userDoc.preferences.notifications);
              setMarketingEmails(userDoc.preferences.marketingEmails);
            }
            
            // Fetch user's brands
            await fetchUserBrands(user.uid);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/login";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const roleOptions = [
    {
      value: "event-planner" as UserRole,
      label: "Event Planner",
      icon: Users,
      description: "I organize events and need sponsors"
    },
    {
      value: "sponsor" as UserRole,
      label: "Sponsor",
      icon: Building,
      description: "I'm a brand looking to sponsor events"
    },
    {
      value: "both" as UserRole,
      label: "Both",
      icon: Crown,
      description: "I do both event planning and sponsoring"
    }
  ];

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updateData = {
        fullName,
        role: role as UserRole,
        location,
        bio,
        preferences: {
          notifications,
          marketingEmails
        },
        completedOnboarding: true,
        updatedAt: new Date()
      };

      await updateUser(user.uid, updateData);
      
      // Refresh user data to update the profile display
      const updatedUserData = await getUserById(user.uid);
      if (updatedUserData) {
        setUserData(updatedUserData);
      }
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBrand = async () => {
    if (!user) return;
    
    setSavingBrand(true);
    try {
      const brandData = {
        ownerId: user.uid,
        name: brandName,
        category: brandCategory,
        description: brandDescription,
        location: brandLocation,
        dealType: brandDealType as DealType,
        contact: {
          representative: contactRepresentative,
          email: contactEmail,
          phone: contactPhone || undefined
        },
        unlockContactPaid
      };

      // Try to create brand with logo, fallback to without logo if storage fails
      try {
        await createBrand(brandData, brandLogo || undefined);
      } catch (storageError: any) {
        console.warn("Storage upload failed, creating brand without logo:", storageError);
        // Create brand without logo if storage fails
        await createBrand(brandData);
      }
      
      // Reset form
      setBrandName("");
      setBrandLogo(null);
      setBrandCategory("");
      setBrandLocation("");
      setBrandDealType("");
      setBrandDescription("");
      setContactRepresentative("");
      setContactEmail("");
      setContactPhone("");
      setUnlockContactPaid(false);
      
      // Close modal
      setShowAddBrandModal(false);
      
      // Refresh user's brands
      await fetchUserBrands(user.uid);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error creating brand:", error);
      alert("Failed to create brand: " + error.message);
    } finally {
      setSavingBrand(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-400/30 rounded-full blur-lg"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10"
      >
        <Link 
          href="/"
          className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium hidden sm:inline">Back to Home</span>
          <span className="font-medium sm:hidden">Back</span>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto relative z-10 pt-12 sm:pt-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold text-white mb-4">
              Profile Settings
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-8 w-8 text-yellow-400" />
              </motion.div>
            </h1>
          </div>
          <p className="text-xl text-blue-200">
            Manage your profile and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="xl:col-span-3"
          >
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-yellow-400" />
                    Profile Information
                  </CardTitle>
                  {(role === "sponsor" || role === "both") && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setShowAddBrandModal(true)}
                        className="bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400 hover:text-blue-950 hover:border-yellow-400 transition-all duration-300"
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Add Brand
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400/50"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-xl border-4 border-yellow-400/50">
                        {(fullName || userData?.fullName || user?.displayName || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{fullName || userData?.fullName || user?.displayName || "User"}</h3>
                    <p className="text-blue-200 text-sm">{user?.email}</p>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">
                      Email <span className="text-xs text-blue-300">(read-only)</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                      <Input
                        value={user?.email || ""}
                        disabled
                        className="pl-10 bg-white/5 border-white/10 text-blue-200 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-blue-200">
                    I am a... <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {roleOptions.map((option) => {
                      const IconComponent = option.icon;
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            role === option.value
                              ? "border-yellow-400 bg-yellow-400/10"
                              : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              role === option.value 
                                ? "bg-yellow-400 text-blue-950" 
                                : "bg-white/10 text-blue-300"
                            }`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold transition-colors ${
                                role === option.value ? "text-yellow-400" : "text-white"
                              }`}>
                                {option.label}
                              </h3>
                              <p className="text-sm text-blue-200 mt-1">
                                {option.description}
                              </p>
                            </div>
                            {role === option.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
                              >
                                <div className="w-2 h-2 bg-blue-950 rounded-full"></div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 z-10" />
                    <Input
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        setLocationOpen(e.target.value.length > 0);
                      }}
                      onFocus={() => setLocationOpen(true)}
                      onBlur={() => setTimeout(() => setLocationOpen(false), 200)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                      placeholder="Type to search cities..."
                    />
                    <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 opacity-50" />
                    
                    {locationOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-blue-900/95 backdrop-blur-xl border border-blue-700/50 rounded-md shadow-2xl z-20 max-h-64 overflow-y-auto">
                        {usCities
                          .filter(city => 
                            city.toLowerCase().includes(location.toLowerCase()) && city.toLowerCase() !== location.toLowerCase()
                          )
                          .slice(0, 10) // Limit to 10 results for performance
                          .map((city) => (
                            <div
                              key={city}
                              onClick={() => {
                                setLocation(city);
                                setLocationOpen(false);
                              }}
                              className="flex items-center px-3 py-2 text-white hover:bg-white/10 cursor-pointer first:rounded-t-md last:rounded-b-md"
                            >
                              <MapPin className="mr-2 h-4 w-4 text-blue-300" />
                              {city}
                            </div>
                          ))}
                        {usCities.filter(city => 
                          city.toLowerCase().includes(location.toLowerCase()) && city.toLowerCase() !== location.toLowerCase()
                        ).length === 0 && location.length > 0 && (
                          <div className="text-blue-200 p-4 text-center">
                            No cities found matching "{location}"
                          </div>
                        )}
                        {location.length === 0 && (
                          <div className="text-blue-300 p-4 text-center text-sm">
                            Start typing to search cities...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-200">
                    Bio
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <textarea
                      value={bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                      className="w-full pl-10 bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50 min-h-[100px] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                      placeholder="Tell us about yourself and what you do..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Preferences */}
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-yellow-400" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-300" />
                      <span className="text-white text-sm">Notifications</span>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                      className="data-[state=checked]:bg-yellow-400"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-300" />
                      <span className="text-white text-sm">Marketing Emails</span>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                      className="data-[state=checked]:bg-yellow-400"
                    />
                  </div>


                </div>
              </CardContent>
            </Card>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-center p-3 bg-yellow-400/10 border border-yellow-400/30 rounded-lg"
              >
                <p className="text-yellow-400 font-medium">
                  Profile updated successfully! 🎉
                </p>
              </motion.div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving || !role}
              className={`w-full font-semibold text-lg py-6 transition-all duration-300 transform ${
                role && !saving
                  ? "bg-yellow-400 text-blue-950 hover:bg-yellow-300 hover:scale-105"
                  : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-blue-950/20 border-t-blue-950 rounded-full"
                />
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </Button>

            {!role && (
              <p className="text-xs text-blue-300 text-center">
                Please select your role to save changes
              </p>
            )}
          </motion.div>
        </div>

        {/* My Brands Section */}
        {(role === "sponsor" || role === "both") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building className="h-5 w-5 text-yellow-400" />
                    My Brands
                  </CardTitle>
                  {userBrands.length > 0 && (
                    <div className="text-blue-200 text-sm">
                      {userBrands.length} brand{userBrands.length === 1 ? '' : 's'}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingBrands ? (
                  <div className="flex items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-8 w-8 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full"
                    />
                  </div>
                ) : userBrands.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-blue-300 mx-auto mb-4 opacity-50" />
                    <h3 className="text-white text-lg font-medium mb-2">No brands yet</h3>
                    <p className="text-blue-200 mb-6">Create your first brand to start connecting with event planners</p>
                    <Button
                      onClick={() => setShowAddBrandModal(true)}
                      className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold"
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Create Your First Brand
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBrands.map((brand, index) => {
                      const averageRating = calculateAverageRating(brand.reviews);
                      return (
                        <motion.div
                          key={brand.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => window.location.href = `/edit-brand/${brand.id}`}
                        >
                          <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 group-hover:scale-105">
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                {/* Brand Header */}
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-4">
                                    {brand.logoUrl ? (
                                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 bg-white/5 flex-shrink-0">
                                        <img
                                          src={brand.logoUrl}
                                          alt={`${brand.name} logo`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-xl flex-shrink-0">
                                        {brand.name[0].toUpperCase()}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">
                                        {brand.name}
                                      </h3>
                                      <p className="text-blue-200 text-sm truncate">{brand.category}</p>
                                    </div>
                                  </div>
                                  {brand.verified && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="bg-green-400/20 text-green-400 p-2 rounded-full"
                                    >
                                      <Shield className="h-4 w-4" />
                                    </motion.div>
                                  )}
                                </div>

                                {/* Brand Stats */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <span className="text-white font-medium">
                                      {averageRating > 0 ? averageRating : "No reviews"}
                                    </span>
                                    {brand.reviews.length > 0 && (
                                      <span className="text-blue-300 text-sm">
                                        ({brand.reviews.length} review{brand.reviews.length === 1 ? '' : 's'})
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-blue-200 text-sm">
                                    {brand.dealType === "product" && "🎁 Products"}
                                    {brand.dealType === "money" && "💰 Financial"}
                                    {brand.dealType === "both" && "⚡ Hybrid"}
                                  </div>
                                </div>

                                {/* Brand Location */}
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-blue-300" />
                                  <span className="text-blue-200 text-sm">{brand.location}</span>
                                </div>

                                {/* Brand Description Preview */}
                                <p className="text-blue-200 text-sm line-clamp-2">
                                  {brand.description.length > 80 
                                    ? `${brand.description.substring(0, 80)}...` 
                                    : brand.description}
                                </p>

                                {/* Edit Button */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                  <div className="flex items-center gap-2 text-blue-300 text-xs">
                                    <span>Created {new Date(brand.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-300 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                                  >
                                    <Edit3 className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowAddBrandModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-950/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-950/80 to-purple-900/80 backdrop-blur-sm border-b border-white/10 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-400/20 rounded-lg">
                    <Building className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add Your Brand</h2>
                    <p className="text-blue-200">Create a brand profile to connect with event planners</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddBrandModal(false)}
                  className="text-blue-200 hover:text-white hover:bg-white/10 p-2"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5 text-yellow-400" />
                        Brand Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Brand Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Brand Name <span className="text-red-400">*</span>
                        </label>
                        <Input
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                          placeholder="Enter your brand name"
                        />
                      </div>

                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Brand Logo
                        </label>
                        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-yellow-400/50 transition-colors">
                          {brandLogo ? (
                            <div className="space-y-3">
                              <div className="w-16 h-16 mx-auto bg-white/10 rounded-lg flex items-center justify-center">
                                <Upload className="h-6 w-6 text-yellow-400" />
                              </div>
                              <p className="text-yellow-400 text-sm font-medium">{brandLogo.name}</p>
                              <p className="text-blue-300 text-xs">
                                {(brandLogo.size / 1024 / 1024).toFixed(2)}MB
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setBrandLogo(null)}
                                className="text-blue-200 hover:text-white"
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                              <p className="text-blue-200 text-sm">
                                Drop your logo here or{" "}
                                <label className="text-yellow-400 hover:text-yellow-300 underline cursor-pointer">
                                  browse files
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
                                        setBrandLogo(file);
                                      } else if (file) {
                                        alert("File size must be less than 5MB");
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              </p>
                              <p className="text-blue-300 text-xs mt-1">PNG, JPG up to 5MB</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Category */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Category <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Input
                            value={brandCategory}
                            onChange={(e) => {
                              setBrandCategory(e.target.value);
                              setCategoryOpen(e.target.value.length > 0);
                            }}
                            onFocus={() => setCategoryOpen(true)}
                            onBlur={() => setTimeout(() => setCategoryOpen(false), 200)}
                            className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                            placeholder="Type to search categories..."
                          />
                          <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 opacity-50" />
                          
                          {categoryOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-blue-900/95 backdrop-blur-xl border border-blue-700/50 rounded-md shadow-2xl z-20 max-h-48 overflow-y-auto">
                              {brandCategories
                                .filter(category => 
                                  category.toLowerCase().includes(brandCategory.toLowerCase()) && category.toLowerCase() !== brandCategory.toLowerCase()
                                )
                                .slice(0, 8)
                                .map((category) => (
                                  <div
                                    key={category}
                                    onClick={() => {
                                      setBrandCategory(category);
                                      setCategoryOpen(false);
                                    }}
                                    className="flex items-center px-3 py-2 text-white hover:bg-white/10 cursor-pointer first:rounded-t-md last:rounded-b-md"
                                  >
                                    <Tag className="mr-2 h-4 w-4 text-blue-300" />
                                    {category}
                                  </div>
                                ))}
                              {brandCategories.filter(category => 
                                category.toLowerCase().includes(brandCategory.toLowerCase()) && category.toLowerCase() !== brandCategory.toLowerCase()
                              ).length === 0 && brandCategory.length > 0 && (
                                <div className="text-blue-200 p-4 text-center text-sm">
                                  No categories found matching "{brandCategory}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Location <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 z-10" />
                          <Input
                            value={brandLocation}
                            onChange={(e) => {
                              setBrandLocation(e.target.value);
                              setBrandLocationOpen(e.target.value.length > 0);
                            }}
                            onFocus={() => setBrandLocationOpen(true)}
                            onBlur={() => setTimeout(() => setBrandLocationOpen(false), 200)}
                            className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                            placeholder="Type to search cities..."
                          />
                          <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300 opacity-50" />
                          
                          {brandLocationOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-blue-900/95 backdrop-blur-xl border border-blue-700/50 rounded-md shadow-2xl z-20 max-h-48 overflow-y-auto">
                              {usCities
                                .filter(city => 
                                  city.toLowerCase().includes(brandLocation.toLowerCase()) && city.toLowerCase() !== brandLocation.toLowerCase()
                                )
                                .slice(0, 8)
                                .map((city) => (
                                  <div
                                    key={city}
                                    onClick={() => {
                                      setBrandLocation(city);
                                      setBrandLocationOpen(false);
                                    }}
                                    className="flex items-center px-3 py-2 text-white hover:bg-white/10 cursor-pointer first:rounded-t-md last:rounded-b-md"
                                  >
                                    <MapPin className="mr-2 h-4 w-4 text-blue-300" />
                                    {city}
                                  </div>
                                ))}
                              {usCities.filter(city => 
                                city.toLowerCase().includes(brandLocation.toLowerCase()) && city.toLowerCase() !== brandLocation.toLowerCase()
                              ).length === 0 && brandLocation.length > 0 && (
                                <div className="text-blue-200 p-4 text-center text-sm">
                                  No cities found matching "{brandLocation}"
                                </div>
                              )}
                              {brandLocation.length === 0 && (
                                <div className="text-blue-300 p-4 text-center text-sm">
                                  Start typing to search cities...
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Deal Type */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-200">
                          Sponsorship Type <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {dealTypeOptions.map((option) => {
                            const IconComponent = option.icon;
                            return (
                              <motion.button
                                key={option.value}
                                type="button"
                                onClick={() => setBrandDealType(option.value)}
                                className={`relative p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                                  brandDealType === option.value
                                    ? "border-yellow-400 bg-yellow-400/10"
                                    : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10"
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`p-2 rounded-lg ${
                                    brandDealType === option.value 
                                      ? "bg-yellow-400 text-blue-950" 
                                      : "bg-white/10 text-blue-300"
                                  }`}>
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className={`font-medium transition-colors ${
                                      brandDealType === option.value ? "text-yellow-400" : "text-white"
                                    }`}>
                                      {option.label}
                                    </h4>
                                    <p className="text-xs text-blue-200 mt-1">
                                      {option.description}
                                    </p>
                                  </div>
                                  {brandDealType === option.value && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center"
                                    >
                                      <div className="w-1.5 h-1.5 bg-blue-950 rounded-full"></div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-blue-200">
                            Description <span className="text-red-400">*</span>
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
                            className="text-blue-300 hover:text-yellow-400 text-xs"
                          >
                            {showMarkdownPreview ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Edit
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {showMarkdownPreview ? (
                          <div className="w-full bg-white/10 border border-white/20 text-white min-h-[120px] rounded-md px-3 py-2">
                            <div
                              className="prose prose-invert max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: brandDescription ? parseMarkdown(brandDescription) : '<span class="text-blue-300">Nothing to preview yet...</span>'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <textarea
                              value={brandDescription}
                              onChange={(e) => setBrandDescription(e.target.value)}
                              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50 min-h-[120px] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400/20"
                              placeholder="Describe your brand, what you offer, and what types of events you're looking to sponsor..."
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Contact Info */}
                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <User className="h-5 w-5 text-yellow-400" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Representative */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Representative Name <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                          <Input
                            value={contactRepresentative}
                            onChange={(e) => setContactRepresentative(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                            placeholder="Contact person name"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                          <Input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                            placeholder="contact@yourbrand.com"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-blue-200">
                          Phone Number <span className="text-blue-300 text-xs">(optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-300" />
                          <Input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => {
                              // Remove all non-digit characters
                              const digits = e.target.value.replace(/\D/g, '');
                              
                              // Format as (XXX) XXX-XXXX
                              let formatted = '';
                              if (digits.length > 0) {
                                if (digits.length <= 3) {
                                  formatted = `(${digits}`;
                                } else if (digits.length <= 6) {
                                  formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
                                } else {
                                  formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
                                }
                              }
                              setContactPhone(formatted);
                            }}
                            maxLength={14}
                            pattern="^\(\d{3}\) \d{3}-\d{4}$"
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        {contactPhone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(contactPhone) && contactPhone.length > 0 && (
                          <p className="text-red-400 text-xs">Please enter a valid phone number format: (555) 123-4567</p>
                        )}
                      </div>

                      {/* Unlock Contact Toggle */}
                      <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-blue-300" />
                            <span className="text-white text-sm font-medium">Contact Access</span>
                          </div>
                          <Switch
                            checked={unlockContactPaid}
                            onCheckedChange={setUnlockContactPaid}
                            className="data-[state=checked]:bg-yellow-400"
                          />
                        </div>
                        <div className="text-xs text-blue-200">
                          {unlockContactPaid ? (
                            <span className="text-yellow-400">Paid access - Event planners pay to see your contact details</span>
                          ) : (
                            <span className="text-green-400">Free access - Event planners can see your contact details for free</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => setShowAddBrandModal(false)}
                  className="text-blue-200 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBrand}
                  disabled={savingBrand || !brandName || !brandCategory || !brandLocation || !brandDealType || !brandDescription || !contactRepresentative || !contactEmail}
                  className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold px-8"
                >
                  {savingBrand ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-blue-950/20 border-t-blue-950 rounded-full mr-2"
                    />
                  ) : (
                    <Building className="h-4 w-4 mr-2" />
                  )}
                  {savingBrand ? "Creating Brand..." : "Add Brand"}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 