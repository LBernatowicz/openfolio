"use client";

import { ArrowLeft, Briefcase, Calendar, MapPin } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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

export default function ExperiencePage() {
  const t = useTranslations('experience');
  const tNav = useTranslations('nav');
  const router = useRouter();

  // Funkcja pomocnicza do pobierania osiągnięć - bezpieczne podejście z limitem
  const getAchievements = (positionKey: string): string[] => {
    const achievements: string[] = [];
    const maxAchievements = 5; // Maksymalna liczba achievement do sprawdzenia
    
    for (let index = 1; index <= maxAchievements; index++) {
      const key = `jobs.${positionKey}.achievement${index}`;
      const achievement = t(key);
      
      // Sprawdź czy tłumaczenie istnieje - jeśli zwrócona wartość to klucz, oznacza to że tłumaczenie nie istnieje
      if (achievement === key) {
        break;
      }
      
      // Jeśli osiągnięcie istnieje i nie jest puste, dodaj je
      if (achievement && achievement.trim() !== '') {
        achievements.push(achievement);
      } else {
        break;
      }
    }
    
    return achievements;
  };

  // Pobierz dane z tłumaczeń - odwrócona kolejność (najnowsze na górze)
  const experiences: Experience[] = [
    {
      id: '7',
      title: t('jobs.position7.title'),
      company: t('jobs.position7.company'),
      location: t('jobs.position7.location'),
      period: t('jobs.position7.period'),
      description: t('jobs.position7.description'),
      technologies: t('jobs.position7.technologies').split(', '),
      achievements: getAchievements('position7'),
      type: 'contract',
      current: true
    },
    {
      id: '6',
      title: t('jobs.position6.title'),
      company: t('jobs.position6.company'),
      location: t('jobs.position6.location'),
      period: t('jobs.position6.period'),
      description: t('jobs.position6.description'),
      technologies: t('jobs.position6.technologies').split(', '),
      achievements: getAchievements('position6'),
      type: 'contract',
      current: false
    },
    {
      id: '5',
      title: t('jobs.position5.title'),
      company: t('jobs.position5.company'),
      location: t('jobs.position5.location'),
      period: t('jobs.position5.period'),
      description: t('jobs.position5.description'),
      technologies: t('jobs.position5.technologies').split(', '),
      achievements: getAchievements('position5'),
      type: 'contract',
      current: true
    },
    {
      id: '4',
      title: t('jobs.position4.title'),
      company: t('jobs.position4.company'),
      location: t('jobs.position4.location'),
      period: t('jobs.position4.period'),
      description: t('jobs.position4.description'),
      technologies: t('jobs.position4.technologies').split(', '),
      achievements: getAchievements('position4'),
      type: 'contract',
      current: false
    },
    {
      id: '3',
      title: t('jobs.position3.title'),
      company: t('jobs.position3.company'),
      location: t('jobs.position3.location'),
      period: t('jobs.position3.period'),
      description: t('jobs.position3.description'),
      technologies: t('jobs.position3.technologies').split(', '),
      achievements: getAchievements('position3'),
      type: 'full-time',
      current: true
    },
    {
      id: '2',
      title: t('jobs.position2.title'),
      company: t('jobs.position2.company'),
      location: t('jobs.position2.location'),
      period: t('jobs.position2.period'),
      description: t('jobs.position2.description'),
      technologies: t('jobs.position2.technologies').split(', '),
      achievements: getAchievements('position2'),
      type: 'full-time',
      current: false
    },
    {
      id: '1',
      title: t('jobs.position1.title'),
      company: t('jobs.position1.company'),
      location: t('jobs.position1.location'),
      period: t('jobs.position1.period'),
      description: t('jobs.position1.description'),
      technologies: t('jobs.position1.technologies').split(', '),
      achievements: getAchievements('position1'),
      type: 'contract',
      current: false
    }
  ];

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
        return t('types.fullTime');
      case 'part-time':
        return t('types.partTime');
      case 'contract':
        return t('types.contract');
      case 'freelance':
        return t('types.freelance');
      default:
        return t('types.other');
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
              <span className="font-semibold text-lg">{tNav('backToHome')}</span>
            </button>
            
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">{t('title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">{t('myExperience')}</h2>
          <p className="text-gray-400 text-lg">{t('careerHistory')}</p>
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
                          {t('current')}
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
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">{t('technologies')}:</h4>
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
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">{t('achievements')}:</h4>
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
      </div>
    </div>
  );
}
