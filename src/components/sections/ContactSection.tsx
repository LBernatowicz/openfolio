import { Mail, MapPin, Linkedin, Github, Instagram, ExternalLink, MessageCircle } from "lucide-react";
import SectionWrapper from "../ui/SectionWrapper";

export default function ContactSection() {
  return (
    <SectionWrapper width={3} height={1} hasExternalLink={true} style={{gridRow: '4'}}>
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">Zacznijmy współpracę!</h2>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="text-gray-300">lukasz@example.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-gray-300">Warszawa, Polska 🇵🇱</span>
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
            <Linkedin className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
            <Github className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors">
            <Instagram className="w-5 h-5" />
          </button>
        </div>
        
    </SectionWrapper>
  );
}
