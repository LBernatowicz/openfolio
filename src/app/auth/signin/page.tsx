"use client";

import { signIn, getSession } from "next-auth/react";
import { Github } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Zaloguj się do GitHub
            </h1>
            <p className="text-slate-400">
              Aby dodawać komentarze, musisz być zalogowany do GitHub
            </p>
          </div>

          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 border border-slate-600/50"
          >
            <Github className="w-5 h-5" />
            <span>Zaloguj się przez GitHub</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Po zalogowaniu będziesz mógł dodawać komentarze jako swój użytkownik GitHub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
