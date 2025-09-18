import WelcomeSection from "@/components/sections/WelcomeSection";
import AboutSection from "@/components/sections/AboutSection";
import CVSection from "@/components/sections/CVSection";
import NowSection from "@/components/sections/NowSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import QuoteSection from "@/components/sections/QuoteSection";
import TimezoneSection from "@/components/sections/TimezoneSection";
import ContactSection from "@/components/sections/ContactSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-4 gap-6 auto-rows-min">
          <WelcomeSection />
          <AboutSection />
          <CVSection />
          <PortfolioSection />
          <ProjectsSection />
          <ExperienceSection />
          <QuoteSection />
          <NowSection />
          <TimezoneSection />
          <ContactSection />
        </div>
      </div>
    </div>
  );
}