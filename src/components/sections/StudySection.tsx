"use client";

import { GraduationCap, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";

export default function StudySection() {
  const t = useTranslations('education');
  const router = useRouter();

  const handleClick = () => {
    router.push('/education');
  };

  return (
    <SectionWrapper width={1} height={1} hasExternalLink={true} onClick={handleClick}>
        <div 
          className="flex items-center gap-2 mb-6"
        >
          <GraduationCap className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
        </div>
        <div className="space-y-4">
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">{t('degree')}</h3>
            <p className="text-gray-400 text-sm">{t('university')} • {t('period')}</p>
            <p className="text-gray-300 text-xs mt-1">{t('specialization')}</p>
          </div>
          <div className="border-l-2 border-blue-500 pl-4">
            <h3 className="font-semibold text-white">{t('courses')}</h3>
            <p className="text-gray-400 text-sm">{t('platforms')} • 2020 - {t('current')}</p>
            <p className="text-gray-300 text-xs mt-1">{t('technologies')}</p>
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

