"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Users, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Shield,
    title: "🛡️ Verified Brands",
    description: "Every sponsor is thoroughly vetted and verified. No sketchy companies, only legitimate brands that care about your audience.",
  },
  {
    icon: Zap,
    title: "⚡ Ghost-Proof Guarantee",
    description: "Tired of sponsors who disappear? Our guarantee ensures reliable communication and payment. No more chasing ghosts.",
  },
  {
    icon: Users,
    title: "🎯 Smart Matching",
    description: "AI-powered matching based on your audience demographics, event type, and brand preferences. Perfect fits every time.",
  },
  {
    icon: CreditCard,
    title: "💳 Pay-to-Unlock Contact",
    description: "Small fee to unlock sponsor contact info keeps the platform spam-free and ensures serious connections only.",
  },
];

export function FeatureHighlights() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Why Event Planners{" "}
            <span className="text-yellow-400">Love Us</span>
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            We've built the perfect platform to connect authentic events with brands that actually care about your community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <CardContent className="p-6 text-center h-full flex flex-col">
                  <div className="mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-yellow-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-blue-200 leading-relaxed flex-grow">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="text-4xl font-bold text-yellow-400">1000+</div>
            <div className="text-blue-200">Verified Brands</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-yellow-400">50K+</div>
            <div className="text-blue-200">Successful Matches</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-yellow-400">98%</div>
            <div className="text-blue-200">Success Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 