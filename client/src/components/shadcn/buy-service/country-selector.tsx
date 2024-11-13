// import React from 'react';
// import { Input } from './../ui/input';
// import { Button } from './../ui/button';
// import { ScrollArea } from './../ui/scrollarea';
// import { Search, Star, RefreshCcw } from 'lucide-react';
// import { SelectedTile } from './SelectedTile';
// import { Country } from './types';
// import Loader2 from '../../../common/loader2';
// import { useTranslation } from 'react-i18next';

// interface CountrySelectorProps {
//   selectedCountry: Country | null;
//   setSelectedCountry: (country: Country | null) => void;
//   countries: Country[];
//   countrySearch: string;
//   setCountrySearch: (search: string) => void;
//   loadingCountries: boolean;
//   errorLoadingCountries: boolean;
//   fetchCountries: () => void;
//   favorites: { countries: Record<string, boolean> };
//   toggleFavorite: (type: 'countries' | 'services', id: string) => void;
// }

// export const CountrySelector: React.FC<CountrySelectorProps> = ({
//   selectedCountry,
//   setSelectedCountry,
//   countries,
//   countrySearch,
//   setCountrySearch,
//   loadingCountries,
//   errorLoadingCountries,
//   fetchCountries,
//   favorites,
//   toggleFavorite,
// }) => {
  
//   const {t} = useTranslation();
//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-lg font-semibold">{t('actionsidebar.1.Select country')}</h2>
//       {selectedCountry ? (
//         <SelectedTile
//           item={selectedCountry}
//           onCancel={() => setSelectedCountry(null)}
//           type="country"
//           iso={selectedCountry.iso}
//         />
//       ) : (
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Find country"
//             className="pl-10 dark:bg-boxdark"
//             value={countrySearch}
//             onChange={(e) => setCountrySearch(e.target.value)}
//           />
//         </div>
//       )}

//       {loadingCountries && <Loader2 height="200px" />}

//       {errorLoadingCountries && !loadingCountries && (
//         <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
//           <span>{t('actionsidebar.Error loading countries')}</span>
//           <Button onClick={fetchCountries} variant="outline" size="sm">
//             <RefreshCcw className="w-4 h-4 mr-2" /> {t('actionsidebar.Retry')}
//           </Button>
//         </div>
//       )}

//       {!selectedCountry && !loadingCountries && (
//         <ScrollArea  className="h-[300px] overflow-y-auto pr-4">
//           <div className="space-y-2">
//             {countries.map((country, index) => (
//               <Button
//                 key={`${country.iso}-${index}`}
//                 variant="ghost"
//                 className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                 onClick={() => setSelectedCountry(country)}
//               >
//                 <div className="flex items-center w-full">
//                   <Star
//                     className={`h-5 w-5 mr-2 ${
//                       favorites.countries[country.name] ? 'text-yellow-400' : 'text-gray-400'
//                     } cursor-pointer`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite('countries', country.name);
//                     }}
//                   />
//                   <img
//                     src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
//                     alt={`Flag of ${country.name}`}
//                     className="mr-2"
//                     width={20}
//                     height={20}
//                   />
//                   <span>{country.name}</span>
//                 </div>
//               </Button>
//             ))}
//           </div>
//         </ScrollArea>
//       )}
//     </div>
//   );
// };
import React from 'react'
import { Input } from './../ui/input'
import { Button } from './../ui/button'
import { ScrollArea } from './../ui/scrollarea'
import { Search, Star, RefreshCcw } from 'lucide-react'
import SelectedTile  from './SelectedTile'
import { Country } from './types'
import Loader2 from '../../../common/loader2'
import { useTranslation } from 'react-i18next'

interface CountrySelectorProps {
  order: String
  selectedCountry: Country | null
  setSelectedCountry: (country: Country | null) => void
  countries: Country[]
  countrySearch: string
  setCountrySearch: (search: string) => void
  loadingCountries: boolean
  errorLoadingCountries: boolean
  fetchCountries: () => void
  favorites: { countries: Record<string, boolean> }
  toggleFavorite: (type: 'countries' | 'services', id: string) => void
  getSuccessRate: (countryName: string) => number | null
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  order,
  selectedCountry,
  setSelectedCountry,
  countries,
  countrySearch,
  setCountrySearch,
  loadingCountries,
  errorLoadingCountries,
  fetchCountries,
  favorites,
  toggleFavorite,
  getSuccessRate,
}) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">{order + "."+t('actionsidebar.1.Select country')}</h2>
      {selectedCountry ? (
        <SelectedTile
          item={{
            ...selectedCountry,
            // successRate: getSuccessRate(selectedCountry.name),
          }}
          onCancel={() => setSelectedCountry(null)}
          type="country"
          iso={selectedCountry.iso}
        />
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('actionsidebar.Find country')}
            className="pl-10 dark:bg-boxdark"
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
          />
        </div>
      )}

      {loadingCountries && <Loader2 height={'200px'} />}

      {errorLoadingCountries && !loadingCountries && (
        <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
          <span>{t('actionsidebar.Error loading countries')}</span>
          <Button onClick={fetchCountries} variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" /> {t('actionsidebar.Retry')}
          </Button>
        </div>
      )}

      {!selectedCountry && !loadingCountries && (
        <ScrollArea className="h-[300px] overflow-y-auto p-4 bg-slate-50 dark:bg-boxdark-2">
          <div className="space-y-2">
            {countries.map((country, index) => {
              const successRate = getSuccessRate(country.name)
              return (
                <Button
                  key={`${country.iso}-${index}`}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedCountry(country)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.countries[country.name] ? 'text-yellow-400' : 'text-gray-400'
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite('countries', country.name)
                      }}
                    />
                    <img
                      src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
                      alt={`Flag of ${country.name}`}
                      className="mr-2"
                      width={20}
                      height={20}
                    />
                    <span className="flex-grow">{t(`country.${country.iso}`)}</span>
                    {successRate !== null && (
                      <span className="text-sm text-green-500 dark:text-green-400">{t("actionsidebar.Success")}: 
                        {successRate.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}