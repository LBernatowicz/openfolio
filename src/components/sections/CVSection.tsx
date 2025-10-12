"use client";

import { useState } from "react";
import { FileText, CheckCircle, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import SectionWrapper from "../ui/SectionWrapper";

export default function CVSection() {
  const t = useTranslations('cv');
  const [isRequested, setIsRequested] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('modal.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('modal.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('modal.emailInvalid');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/cv-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });
      
      if (response.ok) {
        setIsRequested(true);
        setShowModal(false);
        console.log('CV request sent successfully');
      } else {
        console.error('Failed to send CV request');
      }
    } catch (error) {
      console.error('Error sending CV request:', error);
      setIsRequested(true);
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  return (
    <>
      <SectionWrapper width={1} height={1} hasExternalLink={false}>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-white whitespace-nowrap">{t('title')}</h2>
        </div>
        
        <div className="w-full h-32 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg mb-4 flex items-center justify-center border border-blue-500/30">
          {isRequested ? (
            <CheckCircle className="w-8 h-8 text-green-400" />
          ) : (
            <Mail className="w-8 h-8 text-blue-400" />
          )}
        </div>
        
        <p className="text-gray-300 text-sm mb-4">
          {isRequested ? t('requestMessage') : t('description')}
        </p>
        
        <button 
          onClick={() => setShowModal(true)}
          disabled={isRequested}
          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
            isRequested 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:scale-105'
          }`}
        >
          {isRequested ? (
            <>
              <CheckCircle className="w-4 h-4" />
              {t('requestSent')}
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" />
              {t('askButton')}
            </>
          )}
        </button>
      </SectionWrapper>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">{t('modal.title')}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('modal.nameLabel')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('modal.namePlaceholder')}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('modal.emailLabel')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('modal.emailPlaceholder')}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {t('modal.cancelButton')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      {t('modal.sendButton')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
