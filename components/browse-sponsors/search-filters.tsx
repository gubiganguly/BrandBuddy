"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Filters {
  category: string;
  dealType: string;
  location: string;
  verifiedOnly: boolean;
  contactUnlock: string;
}

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const categories = [
  "Technology", "Fashion", "Food & Beverage", "Health & Fitness", 
  "Travel", "Entertainment", "Education", "Gaming", "Beauty", "Sports"
];

const locations = [
  "Austin, TX", "San Francisco, CA", "New York, NY", "Los Angeles, CA",
  "Chicago, IL", "Miami, FL", "Seattle, WA", "Denver, CO", "Global"
];

export function SearchFilters({ searchQuery, setSearchQuery, filters, setFilters }: SearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const activeFiltersCount = Object.values(filters).filter(value => 
    typeof value === 'boolean' ? value : (value !== '' && value !== 'all')
  ).length;

  const clearAllFilters = () => {
    setFilters({
      category: "all",
      dealType: "all",
      location: "all",
      verifiedOnly: false,
      contactUnlock: "all",
    });
  };

  const removeFilter = (filterKey: keyof Filters) => {
    if (filterKey === 'verifiedOnly') {
      setFilters({ ...filters, [filterKey]: false });
    } else {
      setFilters({ ...filters, [filterKey]: "all" });
    }
  };

  const getActiveFilterChips = () => {
    const chips = [];
    
    if (filters.category !== "all") {
      chips.push({ key: "category", label: filters.category, value: filters.category });
    }
    if (filters.dealType !== "all") {
      chips.push({ key: "dealType", label: `Deal: ${filters.dealType}`, value: filters.dealType });
    }
    if (filters.location !== "all") {
      chips.push({ key: "location", label: filters.location, value: filters.location });
    }
    if (filters.contactUnlock !== "all") {
      chips.push({ key: "contactUnlock", label: `${filters.contactUnlock} access`, value: filters.contactUnlock });
    }
    if (filters.verifiedOnly) {
      chips.push({ key: "verifiedOnly", label: "Verified Only", value: "true" });
    }
    
    return chips;
  };

  const activeChips = getActiveFilterChips();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="space-y-4"
    >
      {/* Main Search Box with Integrated Filters */}
      <div className="relative">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <Search className="h-6 w-6 text-blue-300 flex-shrink-0" />
            
            {/* Search Input */}
            <Input
              placeholder="Search sponsors by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 bg-transparent text-white text-lg placeholder:text-blue-200 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
            />
            
            {/* Filters Popover Trigger */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:text-yellow-400 hover:bg-white/10 px-3 py-2 h-auto"
                >
                  <Filter className="h-5 w-5" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 h-5 min-w-[20px] text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              
              <PopoverContent 
                className="w-[600px] p-0 bg-gradient-to-br from-blue-900/95 to-purple-900/95 backdrop-blur-xl border-white/20"
                align="end"
                sideOffset={8}
              >
                <div className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white">Filter Results</h3>
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-blue-200 hover:text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Filter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-blue-200">Category</label>
                      <Select value={filters.category} onValueChange={(value) => 
                        setFilters({ ...filters, category: value })
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-900 border-blue-700">
                          <SelectItem value="all" className="text-white hover:bg-blue-800">All Categories</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white hover:bg-blue-800">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Deal Type Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-blue-200">Deal Type</label>
                      <Select value={filters.dealType} onValueChange={(value) => 
                        setFilters({ ...filters, dealType: value })
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-900 border-blue-700">
                          <SelectItem value="all" className="text-white hover:bg-blue-800">All Types</SelectItem>
                          <SelectItem value="cash" className="text-white hover:bg-blue-800">Cash</SelectItem>
                          <SelectItem value="product" className="text-white hover:bg-blue-800">Product</SelectItem>
                          <SelectItem value="both" className="text-white hover:bg-blue-800">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-blue-200">Location</label>
                      <Select value={filters.location} onValueChange={(value) => 
                        setFilters({ ...filters, location: value })
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-900 border-blue-700">
                          <SelectItem value="all" className="text-white hover:bg-blue-800">All Locations</SelectItem>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location} className="text-white hover:bg-blue-800">
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Contact Unlock Filter */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-blue-200">Contact Access</label>
                      <Select value={filters.contactUnlock} onValueChange={(value) => 
                        setFilters({ ...filters, contactUnlock: value })
                      }>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                          <SelectValue placeholder="All Access" />
                        </SelectTrigger>
                        <SelectContent className="bg-blue-900 border-blue-700">
                          <SelectItem value="all" className="text-white hover:bg-blue-800">All Access</SelectItem>
                          <SelectItem value="free" className="text-white hover:bg-blue-800">Free</SelectItem>
                          <SelectItem value="paid" className="text-white hover:bg-blue-800">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Verified Only Checkbox */}
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Checkbox
                      id="verified-only-popup"
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) => 
                        setFilters({ ...filters, verifiedOnly: checked as boolean })
                      }
                      className="border-white/30 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                    />
                    <label htmlFor="verified-only-popup" className="text-white font-medium cursor-pointer">
                      Show only verified sponsors
                    </label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {activeChips.map((chip) => (
              <motion.div
                key={`${chip.key}-${chip.value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/30 pl-3 pr-1 py-1 flex items-center gap-2"
                >
                  {chip.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(chip.key as keyof Filters)}
                    className="h-4 w-4 p-0 hover:bg-yellow-400/20 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 