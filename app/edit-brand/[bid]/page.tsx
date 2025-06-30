"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Star, 
  Shield, 
  Save, 
  Upload,
  ChevronsUpDown,
  Package,
  DollarSign,
  Zap,
  User,
  Mail,
  Phone,
  Tag,
  FileText,
  Eye,
  EyeOff,
  Trash2,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getBrandById, updateBrand, deactivateBrand } from "@/lib/firebase/brands/brandModel";
import { Brand, DealType } from "@/lib/firebase/brands/brandSchema";
import { getCategories, getCities } from "@/lib/config";

// Get categories and cities from centralized config
const brandCategories = getCategories();
const usCities = getCities();

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
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-yellow-400 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-yellow-400 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-yellow-400 mb-4">$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold"><em class="italic">$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4">• $1</li>')
    .replace(/\n/g, '<br />');
};

export default function EditBrandPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.bid as string;

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Form state
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [brandCategory, setBrandCategory] = useState("");
  const [brandLocation, setBrandLocation] = useState("");
  const [brandDealType, setBrandDealType] = useState<DealType | "">("");
  const [brandDescription, setBrandDescription] = useState("");
  const [contactRepresentative, setContactRepresentative] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [unlockContactPaid, setUnlockContactPaid] = useState(false);

  // UI state
  const [brandLocationOpen, setBrandLocationOpen] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  // Calculate average rating
  const calculateAverageRating = (reviews: Brand['reviews']): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.stars, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const brandData = await getBrandById(brandId);
          if (brandData) {
            // Check if user owns this brand
            if (brandData.ownerId !== user.uid) {
              router.push('/profile-settings');
              return;
            }
            
            setBrand(brandData);
            // Populate form fields
            setBrandName(brandData.name);
            setBrandCategory(brandData.category);
            setBrandLocation(brandData.location);
            setBrandDealType(brandData.dealType);
            setBrandDescription(brandData.description);
            setContactRepresentative(brandData.contact.representative);
            setContactEmail(brandData.contact.email);
            setContactPhone(brandData.contact.phone || "");
            setUnlockContactPaid(brandData.unlockContactPaid);
          } else {
            router.push('/profile-settings');
          }
        } catch (error) {
          console.error("Error fetching brand:", error);
          router.push('/profile-settings');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [brandId, router]);

  const handleSave = async () => {
    if (!user || !brand) return;
    
    setSaving(true);
    try {
      const updateData = {
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
        unlockContactPaid,
        updatedAt: new Date()
      };

      await updateBrand(brand.id, updateData, brandLogo || undefined);
      
      // Refresh brand data
      const updatedBrand = await getBrandById(brand.id);
      if (updatedBrand) {
        setBrand(updatedBrand);
      }
      
      // Reset logo file
      setBrandLogo(null);
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error updating brand:", error);
      alert("Failed to update brand: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!brand) return;
    
    try {
      await deactivateBrand(brand.id);
      router.push('/profile-settings');
    } catch (error: any) {
      console.error("Error deleting brand:", error);
      alert("Failed to delete brand: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!brand) {
    return null;
  }

  const averageRating = calculateAverageRating(brand.reviews);

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
      </div>

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10"
      >
        <Link 
          href="/profile-settings"
          className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium hidden sm:inline">Back to Profile</span>
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
           className="text-center mb-8"
         >
           <div className="flex flex-col items-center gap-6 mb-4">
             {brand.logoUrl ? (
               <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-yellow-400/50 bg-white/5 shadow-2xl">
                 <img
                   src={brand.logoUrl}
                   alt={`${brand.name} logo`}
                   className="w-full h-full object-cover"
                 />
               </div>
             ) : (
               <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-4xl border-4 border-yellow-400/50 shadow-2xl">
                 {brand.name[0].toUpperCase()}
               </div>
             )}
             <div className="text-center">
               <h1 className="text-4xl font-bold text-white mb-3">{brand.name}</h1>
               <div className="flex items-center justify-center gap-6">
                 <div className="flex items-center gap-2">
                   <Star className="h-5 w-5 text-yellow-400" />
                   <span className="text-white font-medium">
                     {averageRating > 0 ? averageRating : "No reviews"}
                   </span>
                   {brand.reviews.length > 0 && (
                     <span className="text-blue-300 text-sm">
                       ({brand.reviews.length} review{brand.reviews.length === 1 ? '' : 's'})
                     </span>
                   )}
                 </div>
                 {brand.verified && (
                   <div className="flex items-center gap-2 bg-green-400/20 text-green-400 px-4 py-2 rounded-full border border-green-400/30">
                     <Shield className="h-5 w-5" />
                     <span className="text-sm font-medium">Verified Brand</span>
                   </div>
                 )}
               </div>
             </div>
           </div>
         </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Brand Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="xl:col-span-3 space-y-8"
          >
            {/* Brand Information Card */}
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-yellow-400" />
                  Brand Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                          Drop your new logo here or{" "}
                          <label className="text-yellow-400 hover:text-yellow-300 underline cursor-pointer">
                            browse files
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && file.size <= 5 * 1024 * 1024) {
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

                {/* Basic Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-blue-200">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <Select value={brandCategory} onValueChange={setBrandCategory}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-blue-900 border-blue-700 max-h-60">
                        {brandCategories.map((category) => (
                          <SelectItem 
                            key={category} 
                            value={category}
                            className="text-white hover:bg-blue-800 focus:bg-blue-800"
                          >
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-blue-300" />
                              {category}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Deal Type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-blue-200">
                    Sponsorship Type <span className="text-red-400">*</span>
                  </label>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
                              <h4 className={`font-medium text-sm transition-colors ${
                                brandDealType === option.value ? "text-yellow-400" : "text-white"
                              }`}>
                                {option.label}
                              </h4>
                              <p className="text-xs text-blue-200 mt-1">
                                {option.description}
                              </p>
                            </div>
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
                      <div className="text-xs text-blue-300">
                        <strong>Markdown supported:</strong> Use # for headers, **bold**, *italic*, [links](url), and • for lists
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information Card */}
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-yellow-400" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        const digits = e.target.value.replace(/\D/g, '');
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
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Contact Access Toggle */}
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

                         {/* Reviews Section */}
             {brand.reviews.length > 0 && (
               <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
                 <CardHeader>
                   <CardTitle className="text-white flex items-center gap-2">
                     <Star className="h-5 w-5 text-yellow-400" />
                     Reviews ({brand.reviews.length})
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-4">
                     {brand.reviews.map((review, index) => (
                       <motion.div
                         key={index}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.3, delay: index * 0.1 }}
                         className="bg-white/5 rounded-lg p-4 border border-white/10"
                       >
                         <div className="flex items-start justify-between mb-3">
                           <div className="flex items-center gap-3">
                             <div className="flex items-center gap-1">
                               {[...Array(5)].map((_, i) => (
                                 <Star
                                   key={i}
                                   className={`h-4 w-4 ${
                                     i < review.stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                   }`}
                                 />
                               ))}
                             </div>
                             <span className="text-blue-200 text-sm">
                               by {review.reviewerName || 'Anonymous'}
                             </span>
                           </div>
                           <span className="text-blue-300 text-xs">
                             {new Date(review.createdAt).toLocaleDateString()}
                           </span>
                         </div>
                         <p className="text-white leading-relaxed">{review.review}</p>
                       </motion.div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Brand Status */}
            <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-yellow-400" />
                  Brand Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Verification Status</span>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      brand.verified 
                        ? "bg-green-400/20 text-green-400" 
                        : "bg-yellow-400/20 text-yellow-400"
                    }`}>
                      <Shield className="h-4 w-4" />
                      {brand.verified ? "Verified" : "Pending"}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Created</span>
                    <span className="text-white text-sm">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200 text-sm">Last Updated</span>
                    <span className="text-white text-sm">
                      {new Date(brand.updatedAt).toLocaleDateString()}
                    </span>
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
                  Brand updated successfully! 🎉
                </p>
              </motion.div>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving || !brandName || !brandCategory || !brandLocation || !brandDealType || !brandDescription || !contactRepresentative || !contactEmail}
              className={`w-full font-semibold text-lg py-6 transition-all duration-300 transform ${
                !saving && brandName && brandCategory && brandLocation && brandDealType && brandDescription && contactRepresentative && contactEmail
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

            {/* Delete Button */}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="w-full text-red-300 border-red-300/30 hover:bg-red-500/20 hover:text-red-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Brand
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-950/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Brand</h3>
              <p className="text-blue-200">
                Are you sure you want to delete "{brand.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 text-blue-200 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
