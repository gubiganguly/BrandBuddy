import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeatureHighlights } from "@/components/feature-highlights";
import { CallToAction } from "@/components/call-to-action";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureHighlights />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
