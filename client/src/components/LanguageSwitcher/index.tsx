 
// import React, { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { ChevronDown, Globe } from 'lucide-react';

// const languages = [
//   { code: 'en', name: 'English', flag: '🇬🇧' },
//   { code: 'es', name: 'Español', flag: '🇪🇸' },
//   { code: 'pt', name: 'Português', flag: '🇵🇹' },
//   { code: 'fr', name: 'Français', flag: '🇫🇷' },
//   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
//   { code: 'it', name: 'Italiano', flag: '🇮🇹' },
//   { code: 'ru', name: 'Русский', flag: '🇷🇺' },
//   { code: 'zh', name: '中文', flag: '🇨🇳' },
//   { code: 'ja', name: '日本語', flag: '🇯🇵' },
//   { code: 'ar', name: 'العربية', flag: '🇸🇦' },
// ];

// export default function LanguageSwitcher() {
//   const { i18n, t } = useTranslation();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const changeLanguageAndPath = (lng: string) => {
//     const currentLanguageCode = i18n.language;
    
//     // Get the pathname without the language prefix
//     let currentPath = location.pathname.replace(new RegExp(`^/${currentLanguageCode}`), '');
//     if (currentPath.startsWith('/')) {
//       currentPath = currentPath.substring(1);
//     }

//     // Step 1: Translate current path to English (using reverseUrls in the current language)
//     const englishPath = t(`reverseUrls.${currentPath}`);

//     // Step 2: Translate the English path to the target language
//     i18n.changeLanguage(lng).then(() => {
//       const newPath = t(`urls.${englishPath}`);
//       navigate(`/${lng}/`, { replace: true });
//       // navigate(`/${lng}/${newPath}`, { replace: true });
//     });
  
//     setIsOpen(false);
//   };

//   const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     const pathLanguage = location.pathname.split('/')[1];
//     if (pathLanguage && languages.some(lang => lang.code === pathLanguage) && pathLanguage !== i18n.language) {
//       i18n.changeLanguage(pathLanguage);
//     }
//   }, [location, i18n]);

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <button
//         type="button"
//         className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white dark:bg-blue-600 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-haspopup="true"
//         aria-expanded={isOpen}
//       >
//         <Globe className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
//         <span className='hidden lg:block'>{currentLanguage.name}</span>
//         <span className='lg:hidden text-xs'>Lang</span>
//         <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
//       </button>

//       {isOpen && (
//         <div className="origin-top-right absolute ml-4 left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-md shadow-lg dark:bg-boxdark-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
//           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
//             {languages.map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => changeLanguageAndPath(lang.code)}
//                 className="hover:bg-blue-400 hover:text-white flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
//                 role="menuitem"
//               >
//                 {lang.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguageAndStay = (lng: string) => {
    const currentLanguageCode = i18n.language;

    // Extract the current path
    let currentPath = location.pathname;

    // Regular expression to check if the path starts with a language code
    const langPrefixRegex = /^\/([a-z]{2})(\/|$)/i;
    const match = currentPath.match(langPrefixRegex);

    if (match) {
      // If a language code is present, replace it with the new one
      currentPath = currentPath.replace(langPrefixRegex, `/${lng}$2`);
    } else {
      // If no language code is present, prepend the new language code
      currentPath = `/${lng}${currentPath}`;
    }

    // Change the language using i18n
    i18n.changeLanguage(lng).then(() => {
      // Navigate to the new path without reloading the page
      navigate(currentPath, { replace: true });
    });

    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const pathLanguage = location.pathname.split('/')[1];
    if (pathLanguage && languages.some(lang => lang.code === pathLanguage) && pathLanguage !== i18n.language) {
      i18n.changeLanguage(pathLanguage);
    }
  }, [location, i18n]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white dark:bg-blue-600 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        <span className='hidden lg:block'>{currentLanguage.name}</span>
        <span className='lg:hidden text-xs'>Lang</span>
        <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
      </button>

      {isOpen && (
         <div className="origin-top-right absolute ml-4 left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-md shadow-lg dark:bg-boxdark-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
         <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
           {languages.map((lang) => (
             <button
               key={lang.code}
               onClick={() => changeLanguageAndStay(lang.code)}
               className="hover:bg-blue-400 hover:text-white flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
               role="menuitem"
             >
               {lang.name}
             </button>
           ))}
         </div>
       </div>
      )}
    </div>
  );
}
