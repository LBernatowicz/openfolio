import { ExternalLink, Briefcase } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function PortfolioSection() {
  return (
    <SectionWrapper width={1} height={1} hasExternalLink={true}>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">Portfolio & Projekty</h2>
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
        </div>
        <div className="text-gray-400 text-center py-8">
          Wkrótce...
        </div>
    </SectionWrapper>
  );
}
