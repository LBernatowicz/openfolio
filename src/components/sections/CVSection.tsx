import { Download } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function CVSection() {
  return (
    <SectionWrapper width={1} height={1}>
        <h2 className="text-2xl font-bold mb-6 text-white">CV</h2>
        <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
          <Download className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Zobacz i pobierz moje CV klikając przycisk poniżej
        </p>
        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Download className="w-4 h-4" />
          Pobierz CV
        </button>
    </SectionWrapper>
  );
}
