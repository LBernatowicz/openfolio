"use client";

import { Briefcase, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";

export default function ExperienceSection() {
  const t = useTranslations('experience');
  const router = useRouter();

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
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">{t('softwareEngineer')}</h3>
            <p className="text-gray-400 text-sm">Straico • 2021 - {t('current')}</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">{t('softwareEngineer')}</h3>
            <p className="text-gray-400 text-sm">Spot2 • 2021 - {t('current')}</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">{t('frontendDeveloper')}</h3>
            <p className="text-gray-400 text-sm">Imaginamos • 2021 - 2021</p>
          </div>
        </div>
        <div className="text-center pt-3">
          <span className="text-xs text-gray-400 font-medium">
            {t('clickToViewDetails')}
          </span>
        </div>
    </SectionWrapper>
  );
}
