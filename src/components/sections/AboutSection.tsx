import { User } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function AboutSection() {
  return (
    <SectionWrapper width={1} height={2}>
        <div className="flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">About me</h2>
        </div>
        <p className="text-gray-300 mb-6">
          Cześć, jestem Łukasz, fullstack developer z Polski 🇵🇱
        </p>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">Główne narzędzia:</h3>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'React', 'Astro', 'Python', 'Php', 'Mongo', 'SQL', 'Nodejs'].map((tech) => (
              <span key={tech} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-300 text-sm break-words">
          Poza programowaniem, pasjonuję się muzyką, podróżowaniem i fotografią. 
          Niezwykłym hobby jest dla mnie gra na gitarze i tworzenie muzyki elektronicznej.
        </p>
    </SectionWrapper>
  );
}
