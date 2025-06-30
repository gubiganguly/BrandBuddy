"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchFilters } from "@/components/browse-sponsors/search-filters";
import { SponsorGrid } from "@/components/browse-sponsors/sponsor-grid";
import { ViewToggle } from "@/components/browse-sponsors/view-toggle";
import { motion } from "framer-motion";

export default function BrowseSponsorsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    dealType: "all",
    location: "all",
    verifiedOnly: false,
    contactUnlock: "all",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900">
      <Navbar />
      
      <main className="py-8">
        {/* Hero Header */}
        <section className="px-4 sm:px-6 lg:px-8 mb-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Browse{" "}
                <span className="relative">
                  <span className="text-yellow-400">Verified</span>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg blur-lg"></div>
                </span>{" "}
                Sponsors
              </h1>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">
                Discover amazing brands ready to sponsor your events. All sponsors are verified and committed to authentic partnerships.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <SearchFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
            />
          </div>
        </section>

        {/* View Toggle and Results */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="text-white">
                <span className="text-2xl font-bold">1,247</span>
                <span className="text-blue-200 ml-2">verified sponsors found</span>
              </div>
              <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            <SponsorGrid 
              viewMode={viewMode}
              searchQuery={searchQuery}
              filters={filters}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 