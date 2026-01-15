"use client";

import { Award, ExternalLink } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";

export default function CoursesSection() {
  const t = useTranslations('courses');
  const router = useRouter();

  const handleClick = () => {
    // Możesz dodać routing do strony z kursami, jeśli będzie potrzebna
    // router.push('/courses');
  };

  return (
    <SectionWrapper width={1} height={1} hasExternalLink={false}>
      <div className="flex items-center gap-2 mb-6">
        <Award className="w-6 h-6 text-blue-500 flex-shrink-0" />
        <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
      </div>
      <div className="space-y-4">
        <div className="border-l-2 border-blue-500 pl-4">
          <h3 className="font-semibold text-white">{t('recent')}</h3>
          <p className="text-gray-400 text-sm">{t('platforms')} • {t('period')}</p>
          <p className="text-gray-300 text-xs mt-1">{t('topics')}</p>
        </div>
        <div className="border-l-2 border-blue-500 pl-4">
          <h3 className="font-semibold text-white">{t('certificates')}</h3>
          <p className="text-gray-400 text-sm">{t('count')}</p>
          <p className="text-gray-300 text-xs mt-1">{t('certificatesDescription')}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}

