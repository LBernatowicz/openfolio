import { Hand, Github, Linkedin, Mail } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function WelcomeSection() {
  return (
    <SectionWrapper width={3} height={0.5}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-white">
              welcome
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Cześć, jestem Łukasz Bernatowicz, programista, inżynier systemów i pasjonat technologii z silnym naciskiem na doświadczenie użytkownika, animacje i mikrointerakcje. Uwielbiam tworzyć piękne i funkcjonalne interfejsy, jestem pasjonatem technologii i zawsze szukam nowych wyzwań.
            </p>
            <div className="flex gap-4">
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Hand className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Linkedin className="w-6 h-6" />
              </button>
              <button className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
                <Mail className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-2xl lg:text-3xl">👨‍💻</span>
            </div>
          </div>
        </div>
    </SectionWrapper>
  );
}
