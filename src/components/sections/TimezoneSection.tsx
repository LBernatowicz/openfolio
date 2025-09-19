import { Clock, MapPin } from "lucide-react";
import VerticalGroup from "../ui/VerticalGroup";

export default function TimezoneSection() {
  return (
    <VerticalGroup width={2} height={2} colStart={2} rowStart={6}>
      <div className="relative bg-gradient-to-br from-slate-900 via-black to-slate-800 border-2 border-blue-500/30 rounded-2xl p-4 card-hover overflow-hidden shadow-2xl shadow-blue-500/20">
        {/* Dramatic ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-cyan-500/40 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-300/30 via-transparent to-blue-300/30 rounded-2xl"></div>
        
        {/* Large animated ambient orbs */}
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -right-12 w-24 h-24 bg-cyan-400/25 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 -left-8 w-20 h-20 bg-indigo-400/20 rounded-full blur-lg animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-teal-400/20 rounded-full blur-md animate-pulse delay-300"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full animate-pulse" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 2px, transparent 2px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 2px, transparent 2px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Glowing border animation */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-cyan-400/10 to-purple-400/20 opacity-60 animate-pulse"></div>
        
        {/* Additional glow effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        
        {/* Content */}
        <div className="relative z-10 mb-2">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-blue-400 flex-shrink-0 drop-shadow-lg" />
            <h2 className="text-xl font-bold text-white whitespace-nowrap drop-shadow-sm">Strefa czasowa</h2>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-300" />
            <span className="text-gray-200 text-sm">Czwartek, 18 września 2024 o 8:16:30</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-300" />
            <span className="text-gray-200 text-sm">Warszawa, Polska 🇵🇱</span>
          </div>
        </div>
      </div>
    </VerticalGroup>
  );
}
