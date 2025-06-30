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
        className="group cursor-pointer"
        onClick={() => router.push(`/browse-sponsors/public-brand/${brand.id}`)}
      >
        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              {/* Large Image */}
              <div className="relative flex-shrink-0 self-center md:self-start">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/5 group-hover:scale-105 transition-transform duration-300">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={`${brand.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-lg md:text-2xl">
                      {brand.name[0].toUpperCase()}
                    </div>
                  )}
                </div>
                {brand.verified && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 md:mb-2">
                  <div className="mb-2 md:mb-0">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-200 mt-1">
                      <MapPin className="h-4 w-4" />
                      {brand.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2 md:mb-0">
                    <span className="text-xl">{dealTypeInfo.emoji}</span>
                    <span className="text-blue-200 text-sm font-medium">{dealTypeInfo.label}</span>
                  </div>
                </div>

                <p className="text-blue-200 text-sm mb-4 line-clamp-2">
                  {brand.description}
                </p>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-6">
                    {/* Rating */}
                    {renderStars(brand.reviews)}

                    {/* Contact Access Badge */}
                    <Badge 
                      className={`w-fit ${
                        !brand.unlockContactPaid
                          ? "bg-green-600/50 text-green-100 hover:bg-green-600/70"
                          : "bg-purple-600/50 text-purple-100 hover:bg-purple-600/70"
                      }`}
                    >
                      {!brand.unlockContactPaid ? "Free Contact" : "Paid Contact"}
                    </Badge>
                  </div>

                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/browse-sponsors/public-brand/${brand.id}`);
                    }}
                    className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold w-full sm:w-auto mt-2 md:mt-0"
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
      whileHover={{ y: -5 }}
      className="group h-full cursor-pointer"
      onClick={() => router.push(`/browse-sponsors/public-brand/${brand.id}`)}
    >
      <Card className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 overflow-hidden p-0">
        <div className="h-full flex flex-col">
          {/* Background Image with Overlays */}
          <div className="relative h-56 bg-gradient-to-br from-white/10 to-white/5">
            {brand.logoUrl ? (
              <>
                <img
                  src={brand.logoUrl}
                  alt={`${brand.name} background`}
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 flex items-center justify-center">
                <div className="text-8xl text-white/30 font-bold">
                  {brand.name[0].toUpperCase()}
                </div>
              </div>
            )}
            
            {/* Top Left - Verified Badge */}
            {brand.verified && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-green-500/90 text-white border-green-400 backdrop-blur-sm">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
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
          <div className="p-4 flex-1 flex flex-col">
            {/* Title and Location */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors mb-2">
                {brand.name}
              </h3>
              <div className="flex items-center gap-2 text-blue-200 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{brand.location}</span>
              </div>
              <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70 w-fit">
                {brand.category}
              </Badge>
            </div>

            {/* Description */}
            <p className="text-blue-200 text-sm mb-3 flex-grow line-clamp-3">
              {brand.description}
            </p>

            {/* Rating */}
            <div className="mb-4">
              {renderStars(brand.reviews)}
            </div>

            {/* Action Button */}
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/browse-sponsors/public-brand/${brand.id}`);
              }}
              className="w-full bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold mt-auto group-hover:scale-105 transition-transform duration-300"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
} 