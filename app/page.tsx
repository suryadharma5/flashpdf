// components
import Features from "@/components/landing-page/features";
import Footer from "@/components/landing-page/footer";
import Guidance from "@/components/landing-page/guidance";
import HeroSection from "@/components/landing-page/hero-section";
import Navbar from "@/components/landing-page/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white p-10">
      <Navbar />
      <div className="pt-24"></div>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <HeroSection />
        <Features />
        {/* <Testimonials /> */}
        <Guidance />
      </div>
      <Footer />
    </div>
  );
}
