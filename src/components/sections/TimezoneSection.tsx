import { Clock, MapPin } from "lucide-react";
import VerticalGroup from "../ui/VerticalGroup";

export default function TimezoneSection() {
  return (
    <VerticalGroup width={2} height={2} colStart={1} rowStart={5}>
      <div className="bg-black border border-slate-700 rounded-2xl p-4 card-hover">
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <h2 className="text-xl font-bold text-white whitespace-nowrap">Strefa czasowa</h2>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-gray-300 text-sm">Czwartek, 18 września 2024 o 8:16:30</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-gray-300 text-sm">Warszawa, Polska 🇵🇱</span>
          </div>
        </div>
      </div>
    </VerticalGroup>
  );
}
