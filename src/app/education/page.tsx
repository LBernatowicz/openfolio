"use client";

import { ArrowLeft, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EducationPage() {
  const router = useRouter();

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
              <h1 className="text-xl font-bold text-white">Edukacja</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="text-center py-16">
          <h2 className="text-4xl font-bold text-white mb-4">Moja Edukacja</h2>
          <p className="text-gray-400 text-lg mb-8">Wkrótce znajdziesz tutaj szczegóły mojej edukacji</p>
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md mx-auto">
            <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-300">Strona w budowie...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
