import { Briefcase } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function ExperienceSection() {
  return (
    <SectionWrapper width={1} height={1} style={{gridRow: '4'}}>
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-white whitespace-nowrap">Expirience</h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Software Engineer</h3>
                  <p className="text-gray-400 text-sm">Straico • 2021 - Obecnie</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Software Engineer</h3>
                  <p className="text-gray-400 text-sm">Spot2 • 2021 - Obecnie</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">Frontend developer</h3>
                  <p className="text-gray-400 text-sm">Imaginamos • 2021 - 2021</p>
          </div>
        </div>
        <button className="text-blue-400 hover:text-blue-300 text-sm mt-4">
          Zobacz więcej
        </button>
    </SectionWrapper>
  );
}
