"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const router = useRouter();
  const [eventLink, setEventLink] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFindSponsors = async () => {
    if (!eventLink.trim()) {
      // If no event link, just go to browse sponsors
      router.push("/browse-sponsors");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/event-scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventLink: eventLink.trim() }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Event data extracted:', result.data);
        
        // Extract categories from event data and pass them to browse sponsors
        const eventCategories = result.data.category;
        let categoriesParam = '';
        
        if (eventCategories) {
          // Handle both single category (string) and multiple categories (array)
          const categoriesArray = Array.isArray(eventCategories) ? eventCategories : [eventCategories];
          categoriesParam = `?categories=${encodeURIComponent(categoriesArray.join(','))}`;
        }
        
        router.push(`/browse-sponsors${categoriesParam}`);
      } else {
        console.error('Failed to scrape event:', result.error);
        alert('Failed to extract event data. Please check the link and try again.');
      }
    } catch (error) {
      console.error('Error calling scrape API:', error);
      alert('An error occurred while processing the event link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-400/30 rounded-full blur-lg"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Find Your Perfect{" "}
              <span className="relative">
                <span className="text-yellow-400 relative z-10">Sponsor</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg blur-lg"></div>
                <motion.div
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-20"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" />
                </motion.div>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-2">
              Paste your event link to get instantly matched with brands that vibe with your audience.
            </p>
          </div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Main Search Box */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Input with Icon */}
                <div className="flex items-center gap-3 flex-1">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300 flex-shrink-0" />
                  <Input
                    placeholder="Paste your event link (e.g. Partiful, Posh)"
                    value={eventLink}
                    onChange={(e) => setEventLink(e.target.value)}
                    className="flex-1 border-0 bg-transparent text-white text-sm sm:text-base lg:text-lg placeholder:text-blue-200 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                  />
                </div>
                
                {/* Find Sponsors Button */}
                <Button 
                  size="lg"
                  onClick={handleFindSponsors}
                  disabled={isLoading}
                  className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold px-4 sm:px-6 py-3 h-auto shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-950 border-t-transparent mr-2" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      <span className="hidden sm:inline">Find Sponsors</span>
                      <span className="sm:hidden">Find Sponsors</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center space-x-3">
              <span className={`text-sm font-medium transition-colors ${!isGlobal ? 'text-yellow-400' : 'text-blue-200'}`}>
                Local
              </span>
              <Switch
                checked={isGlobal}
                onCheckedChange={setIsGlobal}
                className="data-[state=checked]:bg-yellow-400"
              />
              <span className={`text-sm font-medium transition-colors ${isGlobal ? 'text-yellow-400' : 'text-blue-200'}`}>
                Global
              </span>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center items-center gap-8 text-blue-200 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>1000+ Verified Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Ghost-Proof Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Instant Matching</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 