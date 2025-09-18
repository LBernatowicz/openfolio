import { Clock, MapPin } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function TimezoneSection() {
  return (
    <SectionWrapper width={2} height={2}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Strefa czasowa</h2>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-gray-300">Czwartek, 18 września 2024 o 8:16:30</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-gray-300">Warszawa, Polska 🇵🇱</span>
          </div>
        </div>
        
    </SectionWrapper>
  );
}
