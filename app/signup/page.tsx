"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Sparkles, Users, Building, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { signUpWithEmail, signInWithGoogle } from "@/lib/firebase/auth";
import { UserRole } from "@/lib/firebase/users/userSchema";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      alert("Please select your role before creating an account.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const user = await signUpWithEmail(email, password, { name, role: role as UserRole });
      console.log("User created:", { user, name, role });
      // Redirect to browse sponsors on successful signup
      window.location.href = "/browse-sponsors";
    } catch (error: any) {
      console.error("Signup failed:", error.message);
      alert("Signup failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!role) {
      alert("Please select your role before signing up with Google.");
      return;
    }

    try {
      const user = await signInWithGoogle(role as UserRole);
      console.log("Google signup successful:", { user, role });
      // Redirect to browse sponsors on successful signup
      window.location.href = "/browse-sponsors";
    } catch (error: any) {
      console.error("Google signup failed:", error.message);
      alert("Google signup failed: " + error.message);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
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

      {/* Back to Home Link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link 
          href="/"
          className="flex items-center gap-2 text-white hover:text-yellow-400 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </motion.div>

      {/* Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative inline-block"
              >
                <h1 className="text-3xl font-bold text-white mb-2">
                  Join BrandBuddy
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
                Connect with perfect matches in seconds
              </p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-blue-200">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-blue-200">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-300"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-blue-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Role Selector */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="space-y-3"
              >
                                 <label className="text-sm font-medium text-blue-200">
                   I am a... <span className="text-red-400">*</span>
                 </label>
                 {!role && (
                   <p className="text-xs text-blue-300">
                     Please select your role to continue
                   </p>
                 )}
                <div className="grid grid-cols-1 gap-3">
                  {roleOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                                                 onClick={() => setRole(option.value as UserRole)}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                          role === option.value
                            ? "border-yellow-400 bg-yellow-400/10"
                            : "border-white/20 bg-white/5 hover:border-yellow-400/50 hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            role === option.value 
                              ? "bg-yellow-400 text-blue-950" 
                              : "bg-white/10 text-blue-300"
                          }`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold transition-colors ${
                              role === option.value ? "text-yellow-400" : "text-white"
                            }`}>
                              {option.label}
                            </h3>
                            <p className="text-sm text-blue-200 mt-1">
                              {option.description}
                            </p>
                          </div>
                          {role === option.value && (
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

              {/* Create Account Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                                 <Button
                   type="submit"
                   disabled={isLoading || !role}
                   className={`w-full font-semibold text-lg py-6 transition-all duration-300 transform disabled:scale-100 ${
                     role && !isLoading
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
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center my-6"
            >
              <Separator className="flex-1 bg-white/20" />
              <span className="px-4 text-sm text-blue-200">or</span>
              <Separator className="flex-1 bg-white/20" />
            </motion.div>

            {/* Google Sign Up Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
                             <Button
                 type="button"
                 onClick={handleGoogleSignUp}
                 disabled={!role}
                 variant="outline"
                 className={`w-full font-medium py-6 transition-all duration-300 transform ${
                   role 
                     ? "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:scale-105" 
                     : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50"
                 }`}
               >
                <div className="flex items-center gap-3">
                  {/* Google Logo SVG */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                                     Sign up with Google
                 </div>
               </Button>
               {!role && (
                 <motion.p
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.3 }}
                   className="text-xs text-blue-300 text-center mt-2"
                 >
                   Please select your role above to enable Google sign-up
                 </motion.p>
               )}
             </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-center mt-6 pt-6 border-t border-white/10"
            >
              <p className="text-blue-200">
                Already have an account?{" "}
                <Link 
                  href="/login"
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex items-center justify-center gap-6 mt-6 text-blue-200 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Free to Join</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span>Instant Matching</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 