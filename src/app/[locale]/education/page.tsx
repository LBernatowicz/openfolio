"use client";

import { ArrowLeft, GraduationCap, Award, Calendar, Building2, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function EducationPage() {
  const router = useRouter();
  const t = useTranslations('education');

  const certificates = [
    {
      key: 'aws',
      icon: '☁️',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      key: 'react',
      icon: '⚛️',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'docker',
      icon: '🐳',
      color: 'from-blue-600 to-blue-800'
    },
    {
      key: 'typescript',
      icon: '📘',
      color: 'from-blue-700 to-indigo-700'
    }
  ];

  const courses = [
    {
      title: "React Development",
      platform: "Meta",
      period: "2023",
      technologies: "React, JavaScript, ES6+",
      description: "Zaawansowany kurs React i ekosystemu JavaScript"
    },
    {
      title: "AWS Cloud Computing",
      platform: "Amazon Web Services",
      period: "2023",
      technologies: "AWS, CloudFormation, EC2, S3",
      description: "Certyfikacja w zakresie projektowania aplikacji w chmurze AWS"
    },
    {
      title: "Docker & Containers",
      platform: "Docker Inc.",
      period: "2022",
      technologies: "Docker, Kubernetes, DevOps",
      description: "Konteneryzacja aplikacji i zarządzanie infrastrukturą"
    },
    {
      title: "TypeScript Fundamentals",
      platform: "Microsoft",
      period: "2022",
      technologies: "TypeScript, Advanced Patterns",
      description: "Zaawansowane wzorce programowania w TypeScript"
    },
    {
      title: "Node.js Backend",
      platform: "Various",
      period: "2021-2022",
      technologies: "Node.js, Express, MongoDB",
      description: "Tworzenie aplikacji backendowych z Node.js"
    },
    {
      title: "Python & AI",
      platform: "Various",
      period: "2020-2021",
      technologies: "Python, Machine Learning, AI",
      description: "Podstawy programowania w Python i sztucznej inteligencji"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-200" />
              <span className="font-semibold text-lg">Powrót</span>
            </button>
            
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              <h1 className="text-xl font-bold text-white">{t('title')}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* University Education Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white mb-8">{t('title')}</h2>
          
          <SectionWrapper width={1} height={1}>
            <div className="flex items-center gap-3 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              <h3 className="text-2xl font-bold text-white">{t('degree')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300 text-lg">{t('university')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-300">{t('period')}</span>
              </div>
              <p className="text-gray-400 mt-4">{t('specialization')}</p>
            </div>
          </SectionWrapper>
        </div>

        {/* Courses Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-green-500" />
            <h2 className="text-4xl font-bold text-white">{t('courses')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <SectionWrapper key={index} width={1} height={1}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{course.title}</h3>
                      <p className="text-gray-400 text-sm">{course.platform}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{course.period}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <h4 className="text-sm font-semibold text-white mb-1">Technologie</h4>
                      <p className="text-gray-400 text-xs">{course.technologies}</p>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl font-bold text-white">{t('certificates.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <SectionWrapper key={cert.key} width={1} height={1}>
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${cert.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                    {cert.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t(`certificates.items.${cert.key}.title`)}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {t(`certificates.items.${cert.key}.issuer`)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">
                          {t(`certificates.items.${cert.key}.date`)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(`certificates.items.${cert.key}.description`)}
                    </p>
                  </div>
                </div>
              </SectionWrapper>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
