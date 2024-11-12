

// // // // export default PageTitle;
// // // import React, { useEffect } from 'react'
// // // import { useLocation } from 'react-router-dom'
// // // import { useTranslation } from 'react-i18next'

// // // const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ar']; // Add all your supported languages here

// // // const LanguageMetaTags: React.FC = () => {
// // //   const location = useLocation();
// // //   const { i18n } = useTranslation();

// // //   useEffect(() => {
// // //     // Remove any existing hreflang tags
// // //     document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

// // //     // Add hreflang tags for all supported languages
// // //     languages.forEach(lang => {
// // //       const link = document.createElement('link');
// // //       link.rel = 'alternate';
// // //       link.hreflang = lang;
// // //       link.href = `${window.location.origin}/${lang}${location.pathname.replace(/^\/[a-z]{2}/, '')}`;
// // //       document.head.appendChild(link);
// // //     });

// // //     // Add x-default hreflang
// // //     const xDefaultLink = document.createElement('link');
// // //     xDefaultLink.rel = 'alternate';
// // //     xDefaultLink.hreflang = 'x-default';
// // //     xDefaultLink.href = `${window.location.origin}/en/`; // Assuming English is your default language
// // //     document.head.appendChild(xDefaultLink);

// // //     // Cleanup function
// // //     return () => {
// // //       document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
// // //     };
// // //   }, [location, i18n.language]);

// // //   return null; // This component doesn't render anything
// // // };

// // // export default LanguageMetaTags;
// // import React, { useEffect } from 'react'
// // import { useLocation } from 'react-router-dom'
// // import { useTranslation } from 'react-i18next'

// // interface PageTitleProps {
// //   title: string;
// //   lang: string;
// // }

// // const languages = ['en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ar']; // Add all your supported languages here

// // const PageTitle: React.FC<PageTitleProps> = ({ title, lang }) => {
// //   const location = useLocation();
// //   const { i18n } = useTranslation();

// //   useEffect(() => {
// //     // Set the document title
// //     document.title = title;

// //     // Set the lang attribute on the html element
// //     document.documentElement.lang = lang;

// //     // Add or update meta tag for language
// //     let metaLang = document.querySelector('meta[name="language"]');
// //     if (!metaLang) {
// //       metaLang = document.createElement('meta');
// //       metaLang.setAttribute('name', 'language');
// //       document.head.appendChild(metaLang);
// //     }
// //     metaLang.setAttribute('content', lang);

// //     // Remove any existing hreflang tags
// //     document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

// //     // Add hreflang tags for all supported languages
// //     languages.forEach(language => {
// //       const link = document.createElement('link');
// //       link.rel = 'alternate';
// //       link.hreflang = language;
// //       link.href = `${window.location.origin}/${language}${location.pathname.replace(/^\/[a-z]{2}/, '')}`;
// //       document.head.appendChild(link);
// //     });

// //     // Add x-default hreflang
// //     const xDefaultLink = document.createElement('link');
// //     xDefaultLink.rel = 'alternate';
// //     xDefaultLink.hreflang = 'x-default';
// //     xDefaultLink.href = `${window.location.origin}/en/`; // Assuming English is your default language
// //     document.head.appendChild(xDefaultLink);

// //     // Cleanup function
// //     return () => {
// //       document.documentElement.lang = 'en'; // or your default language
// //       document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
// //     };
// //   }, [location, title, lang, i18n.language]);

// //   return null; // This component doesn't render anything
// // };

// // export default PageTitle;
// import React, { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

// const languages = ['en', 'es', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ar']; // Supported languages

// const PageTitle: React.FC<{ title: string; lang: string }> = ({ title, lang }) => {
//   const location = useLocation();
//   const { i18n } = useTranslation();

//   useEffect(() => {
//     // Set the document title
//     document.title = title;

//     // Set the <html> lang attribute
//     document.documentElement.lang = lang;

//     // Clear existing hreflang tags
//     document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());

//     // Add hreflang tags
//     languages.forEach(language => {
//       const link = document.createElement('link');
//       link.rel = 'alternate';
//       link.hreflang = language;
//       link.href = `${window.location.origin}/${language}${location.pathname.replace(/^\/[a-z]{2}/, '')}`;
//       document.head.appendChild(link);
//     });

//     // Add x-default hreflang
//     const xDefaultLink = document.createElement('link');
//     xDefaultLink.rel = 'alternate';
//     xDefaultLink.hreflang = 'x-default';
//     xDefaultLink.href = `${window.location.origin}/`; // Language selector/homepage
//     document.head.appendChild(xDefaultLink);

//     return () => {
//       // Cleanup hreflang tags on unmount
//       document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
//     };
//   }, [lang, title, location]);

//   return null;
// };

// export default PageTitle;
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
