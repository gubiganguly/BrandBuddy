"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Gift, 
  DollarSign, 
  Zap, 
  Shield, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Calendar,
  Building,
  Globe
} from "lucide-react";
import { Brand } from "@/lib/firebase/brands/brandSchema";
import { getBrandById } from "@/lib/firebase/brands/brandModel";

// Helper function to parse markdown
const parseMarkdown = (text: string): string => {
  return text
    .replace(/### (.*$)/gm, '<h3 class="text-lg font-bold text-white mb-2 mt-4">$1</h3>')
    .replace(/## (.*$)/gm, '<h2 class="text-xl font-bold text-white mb-3 mt-6">$1</h2>')
    .replace(/# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 mt-8">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-blue-200">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-yellow-400 hover:text-yellow-300 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^• (.*)$/gm, '<li class="text-blue-200 ml-4">$1</li>')
    .replace(/^\- (.*)$/gm, '<li class="text-blue-200 ml-4">$1</li>')
    .replace(/\n/g, '<br>');
};

export default function PublicBrandPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.bid as string;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBrand = await getBrandById(brandId);
        
        if (!fetchedBrand) {
          setError("Brand not found");
          return;
        }
        
        setBrand(fetchedBrand);
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("Failed to load brand details");
      } finally {
        setLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId]);

  const renderStars = (reviews: Brand['reviews']) => {
    if (reviews.length === 0) {
      return (
        <span className="text-blue-300 text-sm">No reviews yet</span>
      );
    }
    
    const averageRating = reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(averageRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="text-white text-lg font-medium ml-2">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-blue-300 text-sm ml-1">
          ({reviews.length} review{reviews.length === 1 ? '' : 's'})
        </span>
      </div>
    );
  };

  const getDealTypeInfo = (dealType: Brand['dealType']) => {
    switch (dealType) {
      case "money":
        return { icon: <DollarSign className="h-6 w-6 text-green-400" />, label: "Financial Sponsorship", emoji: "💰", color: "green" };
      case "product":
        return { icon: <Gift className="h-6 w-6 text-blue-400" />, label: "Product Sponsorship", emoji: "🎁", color: "blue" };
      case "both":
        return { icon: <Zap className="h-6 w-6 text-purple-400" />, label: "Hybrid Sponsorship", emoji: "⚡", color: "purple" };
      default:
        return { icon: <Gift className="h-6 w-6 text-blue-400" />, label: "Product Sponsorship", emoji: "🎁", color: "blue" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="h-12 w-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-white mb-2">Brand Not Found</h1>
          <p className="text-blue-200 mb-6">{error || "The brand you're looking for doesn't exist."}</p>
          <Button
            onClick={() => router.push("/browse-sponsors")}
            className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const dealTypeInfo = getDealTypeInfo(brand.dealType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900">
      <Navbar />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-purple-400/5 rounded-full blur-xl"
        />
      </div>

      <main className="relative z-10 py-8">
        {/* Back Button */}
        <section className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={() => router.push("/browse-sponsors")}
              variant="ghost"
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse Sponsors
            </Button>
          </div>
        </section>

        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Brand Image */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-yellow-400/50 bg-white/5 shadow-2xl">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-6xl">
                        {brand.name[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  {brand.verified && (
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Brand Title and Info */}
              <h1 className="text-5xl font-bold text-white mb-4">{brand.name}</h1>
              
              <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-blue-200">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{brand.location}</span>
                </div>
                
                <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70 text-lg px-4 py-2">
                  {brand.category}
                </Badge>
                
                <div className={`flex items-center gap-3 bg-${dealTypeInfo.color}-600/20 text-${dealTypeInfo.color}-300 border border-${dealTypeInfo.color}-600/30 px-4 py-2 rounded-full`}>
                  {dealTypeInfo.icon}
                  <span className="font-medium">{dealTypeInfo.label}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-8">
                {renderStars(brand.reviews)}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Brand Details */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* About Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Building className="h-6 w-6 text-yellow-400" />
                        About {brand.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="text-blue-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(brand.description) }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Reviews Section */}
                {brand.reviews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3">
                          <Star className="h-6 w-6 text-yellow-400" />
                          Reviews & Testimonials
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {brand.reviews.map((review, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-3">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.stars
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-400"
                                  }`}
                                />
                              ))}
                              <span className="text-white font-medium ml-2">{review.stars}/5</span>
                            </div>
                            <p className="text-blue-200 mb-3">{review.review}</p>
                            <div className="flex items-center gap-2 text-sm text-blue-300">
                              <User className="h-4 w-4" />
                              <span>{review.reviewerName || "Anonymous"}</span>
                              <span>•</span>
                              <Calendar className="h-4 w-4" />
                              <span>{review.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Contact & Info */}
              <div className="space-y-8">
                
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Mail className="h-6 w-6 text-yellow-400" />
                        Contact Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {brand.unlockContactPaid ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-purple-400" />
                          </div>
                          <h3 className="text-white font-semibold mb-2">Premium Contact Access</h3>
                          <p className="text-blue-200 text-sm mb-4">
                            Unlock contact details to connect with this sponsor
                          </p>
                          <Button className="bg-purple-600 text-white hover:bg-purple-500 font-semibold">
                            <DollarSign className="h-4 w-4 mr-2" />
                            Unlock Contact ($9.99)
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-4 bg-green-900/20 rounded-lg border border-green-600/30">
                            <Shield className="h-5 w-5 text-green-400" />
                            <span className="text-green-300 font-medium">Free Contact Access</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-blue-300" />
                              <div>
                                <p className="text-sm text-blue-200">Representative</p>
                                <p className="text-white font-medium">{brand.contact.representative}</p>
                              </div>
                            </div>
                            
                            <Separator className="bg-white/10" />
                            
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-blue-300" />
                              <div>
                                <p className="text-sm text-blue-200">Email</p>
                                <a 
                                  href={`mailto:${brand.contact.email}`}
                                  className="text-yellow-400 hover:text-yellow-300 font-medium"
                                >
                                  {brand.contact.email}
                                </a>
                              </div>
                            </div>
                            
                            {brand.contact.phone && (
                              <>
                                <Separator className="bg-white/10" />
                                <div className="flex items-center gap-3">
                                  <Phone className="h-5 w-5 text-blue-300" />
                                  <div>
                                    <p className="text-sm text-blue-200">Phone</p>
                                    <a 
                                      href={`tel:${brand.contact.phone}`}
                                      className="text-yellow-400 hover:text-yellow-300 font-medium"
                                    >
                                      {brand.contact.phone}
                                    </a>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Brand Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-3">
                        <Globe className="h-6 w-6 text-yellow-400" />
                        Brand Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Verification Status</span>
                        {brand.verified ? (
                          <Badge className="bg-green-600/50 text-green-100 border-green-400/50">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-600/50 text-gray-100 border-gray-400/50">
                            Pending
                          </Badge>
                        )}
                      </div>
                      
                      <Separator className="bg-white/10" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Deal Type</span>
                        <Badge className={`bg-${dealTypeInfo.color}-600/50 text-${dealTypeInfo.color}-100 border-${dealTypeInfo.color}-400/50`}>
                          {dealTypeInfo.emoji} {dealTypeInfo.label}
                        </Badge>
                      </div>
                      
                      <Separator className="bg-white/10" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Contact Access</span>
                        <Badge className={
                          !brand.unlockContactPaid
                            ? "bg-green-600/50 text-green-100 border-green-400/50"
                            : "bg-purple-600/50 text-purple-100 border-purple-400/50"
                        }>
                          {!brand.unlockContactPaid ? "Free" : "Premium"}
                        </Badge>
                      </div>
                      
                      <Separator className="bg-white/10" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-blue-200">Member Since</span>
                        <span className="text-white">{brand.createdAt.toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
