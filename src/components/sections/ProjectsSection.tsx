import { ExternalLink } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function ProjectsSection() {
  return (
    <SectionWrapper width={1} height={1}>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold text-white">Projekty</h2>
        <ExternalLink className="w-5 h-5" />
      </div>
      <div className="text-gray-400 text-center py-8">
        Wkrótce...
      </div>
    </SectionWrapper>
  );
}
