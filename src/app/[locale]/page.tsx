import WelcomeSection from "@/components/sections/WelcomeSection";
import AboutSection from "@/components/sections/AboutSection";
import CVSection from "@/components/sections/CVSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import StudySection from "@/components/sections/StudySection";
import QuoteTimezoneGroup from "@/components/sections/QuoteTimezoneGroup";
import ContactSection from "@/components/sections/ContactSection";
import NowSection from "@/components/sections/NowSection";
import Navbar from "@/components/ui/Navbar";
import CursorLight from "@/components/ui/CursorLight";
import WelcomeCard from "@/components/ui/WelcomeCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <CursorLight />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Responsive Grid Layout - Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{gridTemplateRows: 'repeat(4, minmax(0, auto))'}}>
          {/* Pierwszy rząd */}
          <WelcomeCard width={3} height={1}>
            <WelcomeSection />
          </WelcomeCard>
          <AboutSection />
          
          {/* Drugi rząd - Portfolio i Now bezpośrednio pod Welcome */}
          <PortfolioSection />
          <NowSection />
          
          {/* Trzeci rząd */}
          <StudySection />
          <QuoteTimezoneGroup />
          <CVSection />
          
          {/* Czwarty rząd */}
          <ExperienceSection />
          <ContactSection />
        </div>
      </div>
    </div>
  );
}