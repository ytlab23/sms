// import React, { useState } from 'react';
// import { Button } from './../ui/button';
// import { X, HelpCircle } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

// interface SelectedTileProps {
//   item: { name: string; price?: number };
//   onCancel: () => void;
//   type: 'country' | 'service';
//   iso?: string;
// }

// export const SelectedTile: React.FC<SelectedTileProps> = ({
//   item,
//   onCancel,
//   type,
//   iso,
// }) => {
//   const [imageError, setImageError] = useState(false);

//   const getImageSrc = () => {
//     if (type === 'country') {
//       return `https://flagcdn.com/w20/${iso?.toLowerCase()}.png`;
//     } else {
//       return `https://logo.clearbit.com/${item.name.toLowerCase()}.com`;
//     }
//   };
//   const { t } = useTranslation();

//   return (
//     <div className="flex items-center justify-between p-3 bg-white dark:bg-boxdark rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
//       <div className="flex items-center space-x-3">
//         {!imageError ? (
//           <img
//             src={getImageSrc()}
//             alt={
//               type === 'country'
//                 ? `Flag of ${item.name}`
//                 : `Icon of ${item.name}`
//             }
//             className="w-6 h-6 object-contain"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
//             <HelpCircle className="w-5 h-5 text-blue-600" />{' '}
//           </div>
//         )}
//         <span className="font-medium">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
//         {type === 'service' && item.price && (
//           <span className="text-sm text-blue-500 dark:text-blue-400">
//             {t("actionsidebar.Price")}: ${item.price.toFixed(2)}
//           </span>
//         )}
//       </div>
//       <Button
//         variant="ghost"
//         size="sm"
//         onClick={onCancel}
//         className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//       >
//         <X className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { Button } from './../ui/button';
import { X, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SelectedTileProps {
  item: { name: string; price?: number; successRate?: number | null };
  onCancel: () => void;
  type: 'country' | 'service';
  iso?: string;
}

export default function Component({ item, onCancel, type, iso }: SelectedTileProps) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  const getImageSrc = () => {
    if (type === 'country') {
      return `https://flagcdn.com/w20/${iso?.toLowerCase()}.png`;
    } else {
      return `https://logo.clearbit.com/${item.name.toLowerCase()}.com`;
    }
  };

  return (
    <div className="flex items-center justify-between p-3  bg-slate-50 dark:bg-boxdark-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3">
        {!imageError ? (
          <img
            src={getImageSrc()}
            alt={type === 'country' ? `Flag of ${item.name}` : `Icon of ${item.name}`}
            className="w-6 h-6 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <div className="flex flex-col">
        {type === 'service' && (  <span className="font-medium">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>)}
        {type === 'country' && (  <span className="font-medium">{t(`country.${iso}`)}</span>)}

          <div className="flex space-x-2 text-sm">
            {type === 'service' && item.price && (
              <span className="text-blue-500 dark:text-blue-400">
                {t("actionsidebar.Price")}: ${item.price.toFixed(2)}
              </span>
            )}
            {item.successRate !== null && item.successRate !== undefined && (
              <span className="text-green-500 dark:text-green-400">
                {t("actionsidebar.Success")}: {item.successRate.toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}