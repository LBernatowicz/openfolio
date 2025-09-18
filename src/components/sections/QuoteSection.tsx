"use client";

import { useState, useEffect } from "react";
import SectionWrapper from "../ui/SectionWrapper";

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
    <SectionWrapper width={2} height={1} className="flex items-center justify-center">
      <div className="text-center w-full">
        <blockquote className="text-lg italic text-gray-300 mb-4 min-h-[60px] flex items-center justify-center">
          "{quotes[currentQuote].text}"
        </blockquote>
        <cite className="text-gray-400">- {quotes[currentQuote].author}</cite>
        
        {/* Subtelny indykator */}
        <div className="flex justify-center mt-4 space-x-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuote(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentQuote 
                  ? 'bg-gray-400 w-6' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Przejdź do cytatu ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
