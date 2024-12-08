
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const languages = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ar']; // Supported languages

const PageTitle: React.FC<{ title: string; lang: string }> = ({ title, lang }) => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set the document title
    document.title = title;

    // Set the <html> lang attribute
    document.documentElement.lang = lang;

    // Clear existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

    // Add hreflang tags for each language
    languages.forEach(language => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = language;
      link.href = `${window.location.origin}/${language}${location.pathname.replace(/^\/[a-z]{2}/, '')}`;
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const xDefaultLink = document.createElement('link');
    xDefaultLink.rel = 'alternate';
    xDefaultLink.hreflang = 'x-default';
    xDefaultLink.href = `${window.location.origin}/`; // Language selector/homepage
    document.head.appendChild(xDefaultLink);

    return () => {
      // Cleanup hreflang tags on unmount
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
    };
  }, [lang, title, location]);

  return null;
};

export default PageTitle;
