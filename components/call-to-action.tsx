"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export function CallToAction() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-3xl p-8 sm:p-12 lg:p-16"
        >
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-yellow-200/50 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-yellow-500/30 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-600 fill-current" />
                  ))}
                </div>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-950 leading-tight">
                Are you a brand?{" "}
                <br className="hidden sm:block" />
                <span className="relative">
                  Get discovered
                  <motion.div
                    className="absolute inset-0 bg-blue-950/10 rounded-xl -skew-x-12"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </span>{" "}
                by top-tier events.
              </h2>

              <p className="text-xl sm:text-2xl text-blue-800 max-w-3xl mx-auto font-medium">
                Join 1000+ verified brands getting authentic exposure through events that actually match your target audience. No spam, no fake followers, just real connections.
              </p>

              <div className="pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-blue-950 text-white hover:bg-blue-900 font-semibold text-lg px-8 py-4 h-auto shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join as a Brand
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center items-center gap-8 text-blue-800 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Free to browse events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Pay only for connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Verified events only</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 