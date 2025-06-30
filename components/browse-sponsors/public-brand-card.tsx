"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Gift, DollarSign, Zap, Shield, Eye, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Brand } from "@/lib/firebase/brands/brandSchema";

interface PublicBrandCardProps {
  brand: Brand;
  viewMode: "grid" | "list";
}

export function PublicBrandCard({ brand, viewMode }: PublicBrandCardProps) {
  const router = useRouter();

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
            className={`h-4 w-4 ${
              i < Math.floor(averageRating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400"
            }`}
          />
        ))}
        <span className="text-white text-sm font-medium ml-1">
          {averageRating.toFixed(1)}
        </span>
        <span className="text-blue-300 text-xs">
          ({reviews.length})
        </span>
      </div>
    );
  };

  const getDealTypeIcon = (dealType: Brand['dealType']) => {
    switch (dealType) {
      case "money":
        return { icon: <DollarSign className="h-4 w-4 text-green-400" />, label: "Financial", emoji: "💰" };
      case "product":
        return { icon: <Gift className="h-4 w-4 text-blue-400" />, label: "Products", emoji: "🎁" };
      case "both":
        return { icon: <Zap className="h-4 w-4 text-purple-400" />, label: "Hybrid", emoji: "⚡" };
      default:
        return { icon: <Gift className="h-4 w-4 text-blue-400" />, label: "Products", emoji: "🎁" };
    }
  };

  const dealTypeInfo = getDealTypeIcon(brand.dealType);



  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group"
      >
        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Large Image */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/5 group-hover:scale-105 transition-transform duration-300">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-2xl">
                      {brand.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {brand.verified && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-blue-200 mt-1">
                      <MapPin className="h-4 w-4" />
                      {brand.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70">
                      {brand.category}
                    </Badge>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                      {dealTypeInfo.icon}
                      <span className="text-white text-sm font-medium">{dealTypeInfo.label}</span>
                    </div>
                  </div>
                </div>



                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Rating */}
                    {renderStars(brand.reviews)}

                    {/* Contact Access Badge */}
                    <Badge 
                      className={
                        !brand.unlockContactPaid
                          ? "bg-green-600/50 text-green-100 hover:bg-green-600/70"
                          : "bg-purple-600/50 text-purple-100 hover:bg-purple-600/70"
                      }
                    >
                      {!brand.unlockContactPaid ? "Free Contact" : "Paid Contact"}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => router.push(`/browse-sponsors/public-brand/${brand.id}`)}
                    className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group h-full"
    >
      <Card className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          {/* Large Image Section - Takes up most of the space */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            {brand.logoUrl ? (
              <img
                src={brand.logoUrl}
                alt={`${brand.name} logo`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-6xl group-hover:scale-105 transition-transform duration-500">
                {brand.name[0].toUpperCase()}
              </div>
            )}
            
            {/* Overlay with verification and deal type */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Top Right - Verification Badge */}
            {brand.verified && (
              <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            )}
            
            {/* Bottom Left - Deal Type */}
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xl">{dealTypeInfo.emoji}</span>
                <span className="text-white text-sm font-medium">{dealTypeInfo.label}</span>
              </div>
            </div>

            {/* Bottom Right - Contact Access */}
            <div className="absolute bottom-3 right-3">
              <Badge 
                className={`${
                  !brand.unlockContactPaid
                    ? "bg-green-500/90 text-white border-green-400"
                    : "bg-purple-500/90 text-white border-purple-400"
                } backdrop-blur-sm`}
              >
                {!brand.unlockContactPaid ? (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Free
                  </>
                ) : (
                  <>
                    <Lock className="h-3 w-3 mr-1" />
                    Paid
                  </>
                )}
              </Badge>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Title and Location */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-1 line-clamp-1">
                {brand.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-blue-200">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{brand.location}</span>
              </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70 w-fit">
                {brand.category}
              </Badge>
            </div>

            {/* Rating */}
            <div className="mb-4">
              {renderStars(brand.reviews)}
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => router.push(`/browse-sponsors/public-brand/${brand.id}`)}
              className="w-full bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold mt-auto group-hover:scale-105 transition-transform duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 