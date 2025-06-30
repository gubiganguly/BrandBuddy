"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, Crown, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateUserRole } from "@/lib/firebase/users/userModel";
import { UserRole } from "@/lib/firebase/users/userSchema";

interface RoleSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
}

export function RoleSelectionPopup({ isOpen, onClose, userId, userName }: RoleSelectionPopupProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      alert("Please select your role before continuing.");
      return;
    }

    setIsLoading(true);
    
    try {
      await updateUserRole(userId, selectedRole as UserRole);
      console.log("Role updated successfully:", selectedRole);
      onClose();
      // Optionally refresh the page or update UI
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to update role:", error.message);
      alert("Failed to update role: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "event-planner" as UserRole,
      label: "Event Planner",
      icon: Users,
      description: "I organize events and need sponsors"
    },
    {
      value: "sponsor" as UserRole,
      label: "Sponsor",
      icon: Building,
      description: "I'm a brand looking to sponsor events"
    },
    {
      value: "both" as UserRole,
      label: "Both",
      icon: Crown,
      description: "I do both event planning and sponsoring"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Popup Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-md relative"
            >
              <Card className="bg-gradient-to-br from-blue-950/95 via-blue-900/95 to-purple-900/95 backdrop-blur-xl border-white/20 shadow-2xl">
                <CardContent className="p-8 relative">
                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-yellow-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="relative inline-block"
                    >
                      <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome to BrandBuddy!
                        <motion.div
                          className="absolute -top-1 -right-1"
                          animate={{ rotate: [0, 15, -15, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        </motion.div>
                      </h1>
                    </motion.div>
                    <p className="text-blue-200">
                      {userName ? `Hi ${userName}! ` : ""}Tell us about yourself to get started
                    </p>
                  </div>

                  {/* Role Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-4 mb-8"
                  >
                    <label className="text-sm font-medium text-blue-200 block">
                      I am a... <span className="text-red-400">*</span>
                    </label>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {roleOptions.map((option) => {
                        const IconComponent = option.icon;
                        return (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => setSelectedRole(option.value)}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                              selectedRole === option.value
                                ? "border-yellow-400 bg-yellow-400/10"
                                : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                selectedRole === option.value 
                                  ? "bg-yellow-400 text-blue-950" 
                                  : "bg-white/10 text-blue-300"
                              }`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className={`font-semibold transition-colors ${
                                  selectedRole === option.value ? "text-yellow-400" : "text-white"
                                }`}>
                                  {option.label}
                                </h3>
                                <p className="text-sm text-blue-200 mt-1">
                                  {option.description}
                                </p>
                              </div>
                              {selectedRole === option.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center"
                                >
                                  <div className="w-2 h-2 bg-blue-950 rounded-full"></div>
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Continue Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Button
                      onClick={handleRoleSelection}
                      disabled={isLoading || !selectedRole}
                      className={`w-full font-semibold text-lg py-6 transition-all duration-300 transform disabled:scale-100 ${
                        selectedRole && !isLoading
                          ? "bg-yellow-400 text-blue-950 hover:bg-yellow-300 hover:scale-105"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-5 w-5 border-2 border-blue-950/20 border-t-blue-950 rounded-full"
                        />
                      ) : (
                        "Continue to BrandBuddy"
                      )}
                    </Button>
                  </motion.div>

                  {/* Helper Text */}
                  {!selectedRole && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs text-blue-300 text-center mt-3"
                    >
                      Please select your role to continue
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 