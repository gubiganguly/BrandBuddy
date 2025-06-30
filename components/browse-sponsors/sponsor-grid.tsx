"use client";

import { useMemo } from "react";
import { SponsorCard } from "@/components/browse-sponsors/sponsor-card";
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

interface Filters {
  category: string;
  dealType: string;
  location: string;
  verifiedOnly: boolean;
  contactUnlock: string;
}

interface SponsorGridProps {
  viewMode: "grid" | "list";
  searchQuery: string;
  filters: Filters;
}

// Mock sponsor data
const mockSponsors: Sponsor[] = [
  {
    id: "1",
    name: "TechFlow",
    logo: "🚀",
    location: "Austin, TX",
    category: "Technology",
    dealTypes: ["cash", "product"],
    rating: 4.9,
    reviewCount: 127,
    verified: true,
    contactUnlock: "paid",
    description: "Leading tech startup specializing in AI-powered solutions for event management.",
    tags: ["AI", "SaaS", "Innovation"],
  },
  {
    id: "2",
    name: "GreenLife",
    logo: "🌱",
    location: "San Francisco, CA",
    category: "Health & Fitness",
    dealTypes: ["product"],
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    contactUnlock: "free",
    description: "Sustainable wellness brand promoting healthy lifestyle through organic products.",
    tags: ["Organic", "Wellness", "Sustainable"],
  },
  {
    id: "3",
    name: "StyleVibe",
    logo: "👗",
    location: "New York, NY",
    category: "Fashion",
    dealTypes: ["cash", "product"],
    rating: 4.8,
    reviewCount: 203,
    verified: true,
    contactUnlock: "paid",
    description: "Trendy fashion brand targeting Gen-Z with sustainable and affordable clothing.",
    tags: ["Sustainable", "Gen-Z", "Trendy"],
  },
  {
    id: "4",
    name: "FoodieHub",
    logo: "🍕",
    location: "Chicago, IL",
    category: "Food & Beverage",
    dealTypes: ["product"],
    rating: 4.6,
    reviewCount: 156,
    verified: true,
    contactUnlock: "free",
    description: "Gourmet food delivery service connecting local restaurants with food lovers.",
    tags: ["Local", "Gourmet", "Delivery"],
  },
  {
    id: "5",
    name: "GameCraft",
    logo: "🎮",
    location: "Seattle, WA",
    category: "Gaming",
    dealTypes: ["cash"],
    rating: 4.9,
    reviewCount: 342,
    verified: true,
    contactUnlock: "paid",
    description: "Indie game studio creating immersive gaming experiences for mobile and PC.",
    tags: ["Indie", "Mobile", "PC"],
  },
  {
    id: "6",
    name: "BeautyBliss",
    logo: "💄",
    location: "Los Angeles, CA",
    category: "Beauty",
    dealTypes: ["product"],
    rating: 4.5,
    reviewCount: 98,
    verified: false,
    contactUnlock: "free",
    description: "Cruelty-free beauty brand with products made from natural ingredients.",
    tags: ["Cruelty-free", "Natural", "Vegan"],
  },
  {
    id: "7",
    name: "TravelSphere",
    logo: "✈️",
    location: "Miami, FL",
    category: "Travel",
    dealTypes: ["cash", "product"],
    rating: 4.7,
    reviewCount: 234,
    verified: true,
    contactUnlock: "paid",
    description: "Premium travel booking platform offering curated experiences worldwide.",
    tags: ["Premium", "Curated", "Worldwide"],
  },
  {
    id: "8",
    name: "EduTech Pro",
    logo: "📚",
    location: "Denver, CO",
    category: "Education",
    dealTypes: ["cash"],
    rating: 4.8,
    reviewCount: 167,
    verified: true,
    contactUnlock: "free",
    description: "Educational technology company revolutionizing online learning experiences.",
    tags: ["EdTech", "Online", "Innovation"],
  },
];

export function SponsorGrid({ viewMode, searchQuery, filters }: SponsorGridProps) {
  const filteredSponsors = useMemo(() => {
    let filtered = mockSponsors;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (sponsor) =>
          sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sponsor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sponsor.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((sponsor) => sponsor.category === filters.category);
    }

    // Deal type filter
    if (filters.dealType && filters.dealType !== "all") {
      if (filters.dealType === "both") {
        filtered = filtered.filter((sponsor) => 
          sponsor.dealTypes.includes("cash") && sponsor.dealTypes.includes("product")
        );
      } else {
        filtered = filtered.filter((sponsor) => 
          sponsor.dealTypes.includes(filters.dealType)
        );
      }
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((sponsor) => sponsor.location === filters.location);
    }

    // Verified filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter((sponsor) => sponsor.verified);
    }

    // Contact unlock filter
    if (filters.contactUnlock && filters.contactUnlock !== "all") {
      filtered = filtered.filter((sponsor) => sponsor.contactUnlock === filters.contactUnlock);
    }

    return filtered;
  }, [searchQuery, filters]);

  return (
    <div>
      {filteredSponsors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No sponsors found</h3>
          <p className="text-blue-200">Try adjusting your filters or search terms</p>
        </motion.div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredSponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SponsorCard sponsor={sponsor} viewMode={viewMode} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 