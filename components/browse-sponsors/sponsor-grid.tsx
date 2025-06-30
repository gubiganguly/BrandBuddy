"use client";

import { useState, useEffect, useMemo } from "react";
import { PublicBrandCard } from "@/components/browse-sponsors/public-brand-card";
import { motion } from "framer-motion";
import { Brand } from "@/lib/firebase/brands/brandSchema";
import { getAllBrands } from "@/lib/firebase/brands/brandModel";

interface Filters {
  categories: string[];
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

export function SponsorGrid({ viewMode, searchQuery, filters }: SponsorGridProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from Firebase
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedBrands = await getAllBrands();
        setBrands(fetchedBrands);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load sponsors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const filteredBrands = useMemo(() => {
    let filtered = brands;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((brand) => filters.categories.includes(brand.category));
    }

    // Deal type filter
    if (filters.dealType && filters.dealType !== "all") {
      if (filters.dealType === "both") {
        filtered = filtered.filter((brand) => brand.dealType === "both");
      } else {
        // Map the filter values to match our schema
        const dealTypeMapping: { [key: string]: Brand['dealType'] } = {
          "cash": "money",
          "product": "product",
          "money": "money"
        };
        const mappedDealType = dealTypeMapping[filters.dealType];
        if (mappedDealType) {
          filtered = filtered.filter((brand) => 
            brand.dealType === mappedDealType || brand.dealType === "both"
          );
        }
      }
    }

    // Location filter
    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((brand) => brand.location === filters.location);
    }

    // Verified filter
    if (filters.verifiedOnly) {
      filtered = filtered.filter((brand) => brand.verified);
    }

    // Contact unlock filter
    if (filters.contactUnlock && filters.contactUnlock !== "all") {
      const isFreeAccess = filters.contactUnlock === "free";
      filtered = filtered.filter((brand) => !brand.unlockContactPaid === isFreeAccess);
    }

    return filtered;
  }, [brands, searchQuery, filters]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full mx-auto mb-4"
        />
        <p className="text-blue-200">Loading sponsors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-2xl font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-blue-200">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {filteredBrands.length === 0 ? (
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
          {filteredBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <PublicBrandCard brand={brand} viewMode={viewMode} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 