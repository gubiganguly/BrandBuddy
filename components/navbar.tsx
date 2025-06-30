"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { User, LogOut, Settings, Shield } from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { logOut } from "@/lib/firebase/auth";
import { getUserById } from "@/lib/firebase/users/userModel";
import { User as UserData } from "@/lib/firebase/users/userSchema";

export function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const navLinks = [
    // Removed navLinks since Browse Sponsors will be a button and How it Works is being removed
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          // Fetch user data from Firestore to get updated fullName
          const userDoc = await getUserById(user.uid);
          setUserData(userDoc);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      // Optionally redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getDisplayName = () => {
    return userData?.fullName || user?.displayName || "User";
  };

  const getProfileInitials = (displayName: string | null, email: string | null) => {
    if (displayName) {
      return displayName.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-blue-950/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors">
              BrandBuddy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            {/* Navigation links removed - Browse Sponsors moved to button */}
          </div>

          {/* Desktop CTA Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/browse-sponsors">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-yellow-400 font-medium transition-colors"
              >
                Browse Sponsors
              </Button>
            </Link>
            {loading ? (
              <div className="h-8 w-16 bg-white/10 rounded animate-pulse"></div>
            ) : user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-sm border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors">
                        {getProfileInitials(getDisplayName(), user.email)}
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-blue-900/95 backdrop-blur-xl border-blue-700/50 shadow-2xl" align="end">
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400/50"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold">
                          {getProfileInitials(getDisplayName(), user.email)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-blue-200 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link href="/profile-settings">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:text-yellow-400 hover:bg-white/10"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:text-yellow-400 hover:bg-white/10"
                      >
                        <Shield className="mr-3 h-4 w-4" />
                        My Sponsorships
                      </Button>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    {/* Logout */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Browse Sponsors + Profile/Login */}
          <div className="md:hidden flex items-center space-x-2">
            <Link href="/browse-sponsors">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-yellow-400 font-medium transition-colors"
              >
                Browse Sponsors
              </Button>
            </Link>
            
            {loading ? (
              <div className="h-8 w-8 bg-white/10 rounded-full animate-pulse"></div>
            ) : user ? (
              // Mobile User Profile Card
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-white/10">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold text-sm border-2 border-yellow-400/50 hover:border-yellow-400 transition-colors">
                        {getProfileInitials(getDisplayName(), user.email)}
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-blue-900/95 backdrop-blur-xl border-blue-700/50 shadow-2xl" align="end">
                  <div className="space-y-4">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-3">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400/50"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-blue-950 font-bold">
                          {getProfileInitials(getDisplayName(), user.email)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {getDisplayName()}
                        </p>
                        <p className="text-blue-200 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link href="/profile-settings">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:text-yellow-400 hover:bg-white/10"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile Settings
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:text-yellow-400 hover:bg-white/10"
                      >
                        <Shield className="mr-3 h-4 w-4" />
                        My Sponsorships
                      </Button>
                    </div>
                    
                    <Separator className="bg-white/20" />
                    
                    {/* Logout */}
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              // Mobile Login Button
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-yellow-400/10 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-300 font-medium transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 