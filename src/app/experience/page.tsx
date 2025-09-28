"use client";

import { ArrowLeft, Briefcase, Calendar, MapPin, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  technologies: string[];
  achievements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  current: boolean;
}

const experiences: Experience[] = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Straico',
    location: 'Remote',
    period: '2021 - Obecnie',
    description: 'Rozwój i utrzymanie aplikacji webowych używając React, Node.js i TypeScript. Praca w zespole Agile z naciskiem na jakość kodu i testy jednostkowe.',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
    achievements: [
      'Zwiększenie wydajności aplikacji o 40% poprzez optymalizację zapytań do bazy danych',
      'Wprowadzenie nowego systemu testów automatycznych, redukując błędy produkcyjne o 60%',
      'Mentoring junior developerów i prowadzenie code review'
    ],
    type: 'full-time',
    current: true
  },
  {
    id: '2',
    title: 'Software Engineer',
    company: 'Spot2',
    location: 'Warsaw, Poland',
    period: '2021 - Obecnie',
    description: 'Tworzenie rozwiązań e-commerce i systemów zarządzania treścią. Praca z mikroserwisami i integracjami z zewnętrznymi API.',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis', 'Kubernetes', 'GitLab CI/CD'],
    achievements: [
      'Projektowanie i implementacja nowego systemu płatności',
      'Migracja monolitycznej aplikacji na architekturę mikroserwisów',
      'Wprowadzenie nowych standardów bezpieczeństwa'
    ],
    type: 'full-time',
    current: true
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Imaginamos',
    location: 'Barcelona, Spain',
    period: '2021 - 2021',
    description: 'Tworzenie interfejsów użytkownika dla aplikacji mobilnych i webowych. Współpraca z designerami i backend developerami.',
    technologies: ['React Native', 'JavaScript', 'Redux', 'Figma', 'REST API'],
    achievements: [
      'Opracowanie komponentów UI używanych w 5+ aplikacjach',
      'Implementacja responsywnych layoutów dla różnych urządzeń',
      'Optymalizacja wydajności aplikacji mobilnych'
    ],
    type: 'contract',
    current: false
  }
];

export default function ExperiencePage() {
  const router = useRouter();

  const getTypeColor = (type: Experience['type']) => {
    switch (type) {
      case 'full-time':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'part-time':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'contract':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'freelance':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getTypeText = (type: Experience['type']) => {
    switch (type) {
      case 'full-time':
        return 'Pełny etat';
      case 'part-time':
        return 'Część etatu';
      case 'contract':
        return 'Kontrakt';
      case 'freelance':
        return 'Freelance';
      default:
        return 'Inne';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-semibold text-lg">Powrót do strony głównej</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">Doświadczenie</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Moje Doświadczenie</h2>
          <p className="text-gray-400 text-lg">Historia mojej kariery zawodowej w branży IT</p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="relative group"
            >
              {/* Timeline line */}
              {index < experiences.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-slate-700 group-hover:bg-blue-500 transition-colors duration-300"></div>
              )}
              
              {/* Timeline dot */}
              <div className="absolute left-5 top-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-black group-hover:scale-125 transition-transform duration-300"></div>
              
              {/* Content */}
              <div className="ml-12 p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-200">
                      {experience.title}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
                      <span>{experience.company}</span>
                      {experience.current && (
                        <span className="px-2 py-1 bg-green-400/10 text-green-400 text-xs rounded-full border border-green-400/20">
                          Obecnie
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{experience.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{experience.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(experience.type)}`}>
                    {getTypeText(experience.type)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {experience.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Technologie:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-slate-700/60 text-slate-200 rounded text-xs font-medium border border-slate-600/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Kluczowe osiągnięcia:</h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20">
            <h3 className="text-2xl font-bold text-white mb-4">Interesuje Cię współpraca?</h3>
            <p className="text-gray-300 mb-6">
              Jestem otwarty na nowe możliwości i projekty. Skontaktuj się ze mną!
            </p>
            <button
              onClick={() => router.push('/#contact')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200"
            >
              <ExternalLink className="w-4 h-4" />
              Skontaktuj się
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
