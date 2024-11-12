// import { useEffect } from 'react'
// import { useLocation } from 'react-router-dom'

// interface PageTitleProps {
//   title: string;
// }

// const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
//   const location = useLocation();

//   useEffect(() => {
//     document.title = title;
//   }, [location, title]);

//   return null; // This component doesn't render anything
// };

// export default PageTitle;
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface PageTitleProps {
  title: string;
  lang: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, lang }) => {
  const location = useLocation();

  useEffect(() => {
    // Set the document title
    document.title = title;

    // Set the lang attribute on the html element
    document.documentElement.lang = lang;

    // Optionally, you can also add a meta tag for language
    let metaLang = document.querySelector('meta[name="language"]');
    if (!metaLang) {
      metaLang = document.createElement('meta');
      metaLang.setAttribute('name', 'language');
      document.head.appendChild(metaLang);
    }
    metaLang.setAttribute('content', lang);

    // Cleanup function to reset the lang attribute when component unmounts
    return () => {
      document.documentElement.lang = 'en'; // or your default language
    };
  }, [location, title, lang]);

  return null; // This component doesn't render anything
};

export default PageTitle;