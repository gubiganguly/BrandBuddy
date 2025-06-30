"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureHighlights } from "@/components/feature-highlights";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";
import { RoleSelectionPopup } from "@/components/role-selection-popup";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { userNeedsOnboarding } from "@/lib/firebase/users/userModel";

export default function Home() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Check if user needs to complete onboarding
        try {
          const needsOnboarding = await userNeedsOnboarding(user.uid);
          setShowRolePopup(needsOnboarding);
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      } else {
        setShowRolePopup(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCloseRolePopup = () => {
    setShowRolePopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-400/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/3 right-10 sm:right-20 w-32 h-32 sm:w-48 sm:h-48 bg-purple-400/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -60, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-blue-400/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            x: [0, -40, 0],
            y: [0, 60, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-20 h-20 sm:w-24 sm:h-24 bg-yellow-400/3 rounded-full blur-xl"
        />
      </div>

      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <FeatureHighlights />
        <CallToAction />
      </main>
      <Footer />
      
      {/* Role Selection Popup */}
      <RoleSelectionPopup
        isOpen={showRolePopup}
        onClose={handleCloseRolePopup}
        userId={user?.uid || ""}
        userName={user?.displayName || ""}
      />
    </div>
  );
}
