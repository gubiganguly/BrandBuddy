"use client";

import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";
import { motion } from "framer-motion";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
      <Button
        variant={viewMode === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("grid")}
        className={`relative transition-all duration-300 ${
          viewMode === "grid"
            ? "bg-yellow-400 text-blue-950 hover:bg-yellow-300 shadow-lg"
            : "text-white hover:text-yellow-400 hover:bg-white/10"
        }`}
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Grid
        {viewMode === "grid" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-yellow-400 rounded-md -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
      
      <Button
        variant={viewMode === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => setViewMode("list")}
        className={`relative transition-all duration-300 ${
          viewMode === "list"
            ? "bg-yellow-400 text-blue-950 hover:bg-yellow-300 shadow-lg"
            : "text-white hover:text-yellow-400 hover:bg-white/10"
        }`}
      >
        <List className="h-4 w-4 mr-2" />
        List
        {viewMode === "list" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-yellow-400 rounded-md -z-10"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
    </div>
  );
} 