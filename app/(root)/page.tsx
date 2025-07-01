import ContactSection from "@/components/HomePage/ContactSection";
import CoreFeatureSection from "@/components/HomePage/CoreFeatures";
import FinalCTASection from "@/components/HomePage/FinalCTASection";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorksSection from "@/components/HomePage/HowItWorks";
import MenuHeadSection from "@/components/HomePage/MenuHeadSection";
import TestimonialsSection from "@/components/HomePage/TestimonialSection";


export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection/>
      <CoreFeatureSection/>
      <HowItWorksSection/>
      <MenuHeadSection/>
      <TestimonialsSection/>
      <FinalCTASection/>
      <ContactSection/>
    </div>
  );
}
