"use client";

import { useState, useEffect } from "react";
import VerticalGroup from "../ui/VerticalGroup";

const quotes = [
  {
    text: "Wszystko, co człowiek może sobie wyobrazić, inni ludzie mogą uczynić rzeczywistością.",
    author: "Jules Verne"
  },
  {
    text: "Programowanie to sztuka rozwiązywania problemów za pomocą kodu.",
    author: "Anonimowy programista"
  },
  {
    text: "Najlepszy sposób na naukę programowania to programowanie.",
    author: "Kent Beck"
  },
  {
    text: "Kod to poezja, która ma sens dla komputera.",
    author: "Paul Graham"
  }
];

export default function QuoteSection() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Opóźnienie bazowe + losowe dla płynności
    const baseDelay = 200; // 200ms bazowe opóźnienie
    const randomDelay = Math.random() * 800; // 0-800ms losowe
    const totalDelay = baseDelay + randomDelay;
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000); // Zmiana co 5 sekund

    return () => clearInterval(interval);
  }, []);

  const goToQuote = (index: number) => {
    setCurrentQuote(index);
  };

  return (
    <VerticalGroup width={2} height={2} colStart={1} rowStart={6}>
      <div className={`bg-transparent border border-slate-700 rounded-2xl p-4 transition-all duration-700 ease-out relative z-20 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-8'
      }`}>
        {/* Tło wewnątrz sekcji zasłaniające światło */}
        <div className="absolute inset-0 bg-black rounded-2xl -z-10"></div>
        <div className="text-center w-full relative z-10">
          <blockquote className="text-base italic text-gray-300 mb-2 min-h-[40px] flex items-center justify-center">
            &ldquo;{quotes[currentQuote].text}&rdquo;
          </blockquote>
          <cite className="text-gray-400 text-sm">- {quotes[currentQuote].author}</cite>
          
          {/* Subtelny indykator */}
          <div className="flex justify-center mt-2 space-x-1">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuote(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentQuote 
                    ? 'bg-gray-400 w-3' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label={`Przejdź do cytatu ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </VerticalGroup>
  );
}
