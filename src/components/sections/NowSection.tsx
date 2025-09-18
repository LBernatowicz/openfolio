import { Activity } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function NowSection() {
  return (
    <SectionWrapper width={1} height={1}>
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">Now</h2>
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
        </div>
        <p className="text-gray-300 mb-4">co to jest?</p>
        <p className="text-gray-300">Obecnie pracuję jako freelancer</p>
    </SectionWrapper>
  );
}
