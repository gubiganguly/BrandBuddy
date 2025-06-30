"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Package, Shield, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  location: string;
  category: string;
  dealTypes: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  contactUnlock: "free" | "paid";
  description: string;
  tags: string[];
}

interface SponsorCardProps {
  sponsor: Sponsor;
  viewMode: "grid" | "list";
}

export function SponsorCard({ sponsor, viewMode }: SponsorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400"
        }`}
      />
    ));
  };

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <DollarSign className="h-4 w-4 text-green-400" />;
      case "product":
        return <Package className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="group"
      >
        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {sponsor.logo}
                </div>
                {sponsor.verified && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                      {sponsor.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-blue-200 mt-1">
                      <MapPin className="h-4 w-4" />
                      {sponsor.location}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {sponsor.dealTypes.map((type) => (
                      <div key={type} className="flex items-center gap-1">
                        {getDealTypeIcon(type)}
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                  {sponsor.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {renderStars(sponsor.rating)}
                      <span className="text-white text-sm font-medium ml-1">
                        {sponsor.rating}
                      </span>
                      <span className="text-blue-300 text-xs">
                        ({sponsor.reviewCount})
                      </span>
                    </div>

                    {/* Category Badge */}
                    <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70">
                      {sponsor.category}
                    </Badge>

                    {/* Contact Access Badge */}
                    <Badge 
                      className={
                        sponsor.contactUnlock === "free"
                          ? "bg-green-600/50 text-green-100 hover:bg-green-600/70"
                          : "bg-purple-600/50 text-purple-100 hover:bg-purple-600/70"
                      }
                    >
                      {sponsor.contactUnlock === "free" ? "Free Access" : "Paid Access"}
                    </Badge>
                  </div>

                  <Button className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
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
      className="group h-full"
    >
      <Card className="h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header with Logo and Verification */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                {sponsor.logo}
              </div>
              {sponsor.verified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              {sponsor.dealTypes.map((type) => (
                <div key={type} className="flex items-center gap-1">
                  {getDealTypeIcon(type)}
                </div>
              ))}
            </div>
          </div>

          {/* Title and Location */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors mb-1">
              {sponsor.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-blue-200">
              <MapPin className="h-3 w-3" />
              {sponsor.location}
            </div>
          </div>

          {/* Description */}
          <p className="text-blue-200 text-sm mb-4 flex-grow line-clamp-3">
            {sponsor.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {sponsor.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-white/30 text-blue-200 hover:border-yellow-400/50 hover:text-yellow-400"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4">
            {renderStars(sponsor.rating)}
            <span className="text-white text-sm font-medium ml-1">
              {sponsor.rating}
            </span>
            <span className="text-blue-300 text-xs">
              ({sponsor.reviewCount})
            </span>
          </div>

          {/* Category and Access */}
          <div className="flex flex-col gap-2 mb-4">
            <Badge className="bg-blue-600/50 text-blue-100 hover:bg-blue-600/70 w-fit">
              {sponsor.category}
            </Badge>
            <Badge 
              className={`w-fit ${
                sponsor.contactUnlock === "free"
                  ? "bg-green-600/50 text-green-100 hover:bg-green-600/70"
                  : "bg-purple-600/50 text-purple-100 hover:bg-purple-600/70"
              }`}
            >
              {sponsor.contactUnlock === "free" ? "Free Access" : "Paid Access"}
            </Badge>
          </div>

          {/* Action Button */}
          <Button className="w-full bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold mt-auto group-hover:scale-105 transition-transform duration-300">
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
} 