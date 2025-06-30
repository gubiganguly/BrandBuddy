"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { getCategories } from "@/lib/config";

interface AutoFilterHandlerProps {
  filters: {
    categories: string[];
    dealType: string;
    location: string;
    verifiedOnly: boolean;
    contactUnlock: string;
  };
  setFilters: (filters: any) => void;
  showAutoFilterNotification: boolean;
  setShowAutoFilterNotification: (show: boolean) => void;
}

function AutoFilterHandlerContent({ 
  filters, 
  setFilters, 
  showAutoFilterNotification, 
  setShowAutoFilterNotification 
}: AutoFilterHandlerProps) {
  const searchParams = useSearchParams();

  // Initialize filters from URL parameters
  useEffect(() => {
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      const availableCategories = getCategories();
      const urlCategories = categoriesParam.split(',').map(cat => decodeURIComponent(cat.trim()));
      
      // Filter to only include valid categories from our config
      const validCategories = urlCategories.filter(cat => availableCategories.includes(cat));
      
      if (validCategories.length > 0) {
        console.log('Auto-selecting categories from event:', validCategories);
        setFilters((prev: any) => ({
          ...prev,
          categories: validCategories
        }));
        
        // Show notification that categories were auto-selected
        setShowAutoFilterNotification(true);
        
        // Hide notification after 5 seconds
        setTimeout(() => setShowAutoFilterNotification(false), 5000);
      }
    }
  }, [searchParams, setFilters, setShowAutoFilterNotification]);

  // Render notification
  if (showAutoFilterNotification) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 text-center"
          >
            <p className="text-yellow-400 font-medium">
              🎯 Great! We've automatically filtered sponsors based on your event's categories.
            </p>
            <p className="text-yellow-300 text-sm mt-1">
              You can adjust the filters below to refine your search further.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return null;
}

export function AutoFilterHandler(props: AutoFilterHandlerProps) {
  return (
    <AutoFilterHandlerContent {...props} />
  );
} 