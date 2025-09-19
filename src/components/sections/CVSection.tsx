import { Download } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function CVSection() {
  return (
    <SectionWrapper width={1} height={1} hasExternalLink={true}>
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">CV</h2>
        </div>
        <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <Download className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Zobacz i pobierz moje CV klikając przycisk poniżej
        </p>
        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
          <Download className="w-4 h-4" />
          Pobierz CV
        </button>
    </SectionWrapper>
  );
}
