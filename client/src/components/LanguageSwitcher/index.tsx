
// // // import React, { useState, useRef, useEffect } from 'react'
// // // import { useTranslation } from 'react-i18next'
// // // import { ChevronDown, Globe } from 'lucide-react'

// // // const languages = [
// // //   { code: 'en', name: 'English', flag: '🇬🇧' },
// // //   { code: 'es', name: 'Español', flag: '🇪🇸' },
// // //   { code: 'pt', name: 'Português', flag: '🇵🇹' },
// // //   { code: 'fr', name: 'Français', flag: '🇫🇷' },
// // //   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
// // //   { code: 'it', name: 'Italiano', flag: '🇮🇹' },
// // //   { code: 'ru', name: 'Русский', flag: '🇷🇺' },
// // //   { code: 'zh', name: '中文', flag: '🇨🇳' },
// // //   { code: 'ja', name: '日本語', flag: '🇯🇵' },
// // //   { code: 'ar', name: 'العربية', flag: '🇸🇦' },
// // // ]

// // // export default function LanguageSwitcher() {
// // //   const { i18n } = useTranslation()
// // //   const [isOpen, setIsOpen] = useState(false)
// // //   const dropdownRef = useRef<HTMLDivElement>(null)

// // //   const changeLanguage = (lng: string) => {
// // //     i18n.changeLanguage(lng)
// // //     setIsOpen(false)
// // //   }

// // //   const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

// // //   useEffect(() => {
// // //     const handleClickOutside = (event: MouseEvent) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
// // //         setIsOpen(false)
// // //       }
// // //     }

// // //     document.addEventListener('mousedown', handleClickOutside)
// // //     return () => {
// // //       document.removeEventListener('mousedown', handleClickOutside)
// // //     }
// // //   }, [])

// // //   return (
// // //     <div className="relative inline-block text-left " ref={dropdownRef}>
// // //       <button
// // //         type="button"
// // //         className=" inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white dark:bg-blue-600 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2  "
// // //         onClick={() => setIsOpen(!isOpen)}
// // //         aria-haspopup="true"
// // //         aria-expanded={isOpen}
// // //       >
// // //         <Globe className="mr-2 h-5 w-5 text-gray-400 " aria-hidden="true" />
// // //         <span className='hidden lg:block'>{currentLanguage.name}</span>
// // //         <span className='lg:hidden text-xs'>Lang</span>
// // //         {/* {currentLanguage.name} */}
// // //         <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
// // //       </button>

// // //       {isOpen && (
// // //         <div className="origin-top-righ absolute ml-4 left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-md shadow-lg dark:bg-boxdark-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ">
// // //           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
// // //             {languages.map((lang) => (
// // //               <button
// // //                 key={lang.code}
// // //                 onClick={() => changeLanguage(lang.code)}
// // //                 className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
// // //                 role="menuitem"
// // //               >
// // //                 {/* <span className="mr-2 text-xl">{lang.flag}</span> */}
// // //                 {lang.name}
                
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }
// // import React, { useState, useRef, useEffect } from 'react';
// // import { useTranslation } from 'react-i18next';
// // import { useNavigate } from 'react-router-dom';
// // import { ChevronDown, Globe } from 'lucide-react';

// // const languages = [
// //   { code: 'en', name: 'English', flag: '🇬🇧' },
// //   { code: 'es', name: 'Español', flag: '🇪🇸' },
// //   { code: 'pt', name: 'Português', flag: '🇵🇹' },
// //   { code: 'fr', name: 'Français', flag: '🇫🇷' },
// //   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
// //   { code: 'it', name: 'Italiano', flag: '🇮🇹' },
// //   { code: 'ru', name: 'Русский', flag: '🇷🇺' },
// //   { code: 'zh', name: '中文', flag: '🇨🇳' },
// //   { code: 'ja', name: '日本語', flag: '🇯🇵' },
// //   { code: 'ar', name: 'العربية', flag: '🇸🇦' },
// // ];

// // export default function LanguageSwitcher() {
// //   const { i18n ,t} = useTranslation();
// //   const navigate = useNavigate();
// //   const [isOpen, setIsOpen] = useState(false);
// //   const dropdownRef = useRef<HTMLDivElement>(null);

// //   const changeLanguageAndPath = (lng: string) => {
// //     // Change language
    
    
// //     // Modify the URL to include the selected language code
// //     let currentPath = window.location.pathname.replace(/^\/(en|es|pt|fr|de|it|ru|zh|ja|ar)/, '');
// //     if (currentPath.startsWith('/')) {
// //       currentPath = currentPath.substring(1);
// //     }  
// //     console.log(currentPath,"------------------");
// //     const newPath = 'reverseUrls.'+currentPath;
// //     const originalPath = t(newPath);
// //     console.log(newPath,"x-men origins",i18n.language,originalPath,"------------------");
// //     const ar = "reverseUrls.الأسئلة-الشائعة";
// //     console.log("arالأسئلة-الشائعة",t(ar),"------------------",i18n.language);
// //     const temp = "urls."+originalPath;
// //     const goTo = t(temp);
// //     i18n.changeLanguage(lng);
// //     console.log("after update",goTo,"------------------",i18n.language);
// //     navigate(`/${lng}/${goTo}`);

// //     // Close the dropdown
// //     setIsOpen(false);
// //   };

// //   const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
// //         setIsOpen(false);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// //   return (
// //     <div className="relative inline-block text-left" ref={dropdownRef}>
// //       <button
// //         type="button"
// //         className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-2 bg-white dark:bg-blue-600 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
// //         onClick={() => setIsOpen(!isOpen)}
// //         aria-haspopup="true"
// //         aria-expanded={isOpen}
// //       >
// //         <Globe className="mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
// //         <span className='hidden lg:block'>{currentLanguage.name}</span>
// //         <span className='lg:hidden text-xs'>Lang</span>
// //         <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
// //       </button>

// //       {isOpen && (
// //         <div className="origin-top-right absolute ml-4 left-1/2 transform -translate-x-1/2 mt-2 w-64 rounded-md shadow-lg dark:bg-boxdark-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
// //           <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
// //             {languages.map((lang) => (
// //               <button
// //                 key={lang.code}
// //                 onClick={() => changeLanguageAndPath(lang.code)}
// //                 className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
// //                 role="menuitem"
// //               >
// //                 {lang.name}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useRef, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
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
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const changeLanguageAndPath = (lng: string) => {
//     // Change language in i18n
//     const currentLanguageCode = i18n.language;
    
//     // Get the pathname without the language prefix
//     let currentPath = window.location.pathname.replace(/^\/(en|es|pt|fr|de|it|ru|zh|ja|ar)/, '');
//     if (currentPath.startsWith('/')) {
//         currentPath = currentPath.substring(1);
//     }

//     // Step 1: Translate current path to English (using reverseUrls in the current language)
//     const englishPath = t(`reverseUrls.${currentPath}`);

//     // Step 2: Translate the English path to the target language
//     i18n.changeLanguage(lng).then(() => {
//       const newPath = t(`urls.${englishPath}`);
//       // console.log('i am changing from', currentLanguageCode, 'to', lng, englishPath, newPath, i18n.language);
//       // console.log("newPath", newPath, "--------------------", t("urls." + newPath));
//       navigate(`/${lng}/${newPath}`);
//     });
  
//     setIsOpen(false);
// };


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
//                 className="hover:bg-blue-400 hover:text-white  flex items-center w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 hover:text-gray-900"
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
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguageAndPath = (lng: string) => {
    const currentLanguageCode = i18n.language;
    
    // Get the pathname without the language prefix
    let currentPath = location.pathname.replace(new RegExp(`^/${currentLanguageCode}`), '');
    if (currentPath.startsWith('/')) {
      currentPath = currentPath.substring(1);
    }

    // Step 1: Translate current path to English (using reverseUrls in the current language)
    const englishPath = t(`reverseUrls.${currentPath}`);

    // Step 2: Translate the English path to the target language
    i18n.changeLanguage(lng).then(() => {
      const newPath = t(`urls.${englishPath}`);
      navigate(`/${lng}/${newPath}`, { replace: true });
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
                onClick={() => changeLanguageAndPath(lang.code)}
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