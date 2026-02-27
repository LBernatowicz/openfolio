"use client";

import { Briefcase, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";

export default function ExperienceSection() {
  const t = useTranslations('experience');
  const router = useRouter();

  const latestExperiences = [
    {
      title: t('jobs.position7.title'),
      company: t('jobs.position7.company'),
      period: t('jobs.position7.period'),
    },
    {
      title: t('jobs.position6.title'),
      company: t('jobs.position6.company'),
      period: t('jobs.position6.period'),
    },
    {
      title: t('jobs.position5.title'),
      company: t('jobs.position5.company'),
      period: t('jobs.position5.period'),
    },
  ];

  const handleClick = () => {
    router.push('/experience');
  };

  return (
    <SectionWrapper width={1} height={1} style={{gridRow: '4'}} hasExternalLink={true} onClick={handleClick}>
        <div 
          className="flex items-center gap-2 mb-6"
        >
          <Briefcase className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
        </div>
        <div className="space-y-4">
          {latestExperiences.map((experience) => (
            <div key={experience.company} className="border-l-2 border-blue-500 pl-4">
              <h3 className="font-semibold text-white">{experience.title}</h3>
              <p className="text-gray-400 text-sm">
                {experience.company} • {experience.period}
              </p>
            </div>
          ))}
        </div>
        <div className="text-center pt-3">
          <span className="text-xs text-gray-400 font-medium">
            {t('clickToViewDetails')}
          </span>
        </div>
    </SectionWrapper>
  );
}
