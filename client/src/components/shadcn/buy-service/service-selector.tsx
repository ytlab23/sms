// import React, { useState } from 'react';
// import { Input } from './../ui/input';
// import { Button } from './../ui/button';
// import { ScrollArea } from './../ui/scrollarea';
// import { Search, Star, RefreshCcw, HelpCircle } from 'lucide-react';
// import { SelectedTile } from './SelectedTile';
// import { Service, Country } from './types';
// import Loader2 from '../../../common/loader2';
// import { useTranslation } from 'react-i18next';

// interface ServiceSelectorProps {
//   selectedService: Service | null;
//   setSelectedService: (service: Service | null) => void;
//   services: Service[];
//   serviceSearch: string;
//   setServiceSearch: (search: string) => void;
//   loadingServices: boolean;
//   errorLoadingServices: boolean;
//   fetchServices: () => void;
//   favorites: { services: Record<string, boolean> };
//   toggleFavorite: (type: 'countries' | 'services', id: string) => void;
//   showMore: boolean;
//   setShowMore: (show: boolean) => void;
//   selectedCountry: Country | null;
//   getServicePrice: (
//     serviceName: string,
//     countryName: string | null,
//   ) => number | null;
//   allPricingData: { [key: string]: number | null };
// }

// export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
//   selectedService,
//   setSelectedService,
//   services,
//   serviceSearch,
//   setServiceSearch,
//   loadingServices,
//   errorLoadingServices,
//   fetchServices,
//   favorites,
//   toggleFavorite,
//   showMore,
//   setShowMore,
//   selectedCountry,
//   getServicePrice,
//   allPricingData,
// }) => {
//   const mainServices = services.filter(
//     (service) => service.main && service.isIncluded,
//   );
//   const includedServices = services.filter((service) => service.isIncluded);
//   const [imageError, setImageError] = useState<Record<string, boolean>>({});
//   const {t} = useTranslation();

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-lg font-semibold">{t("actionsidebar.2.Select service")}</h2>
//       {selectedService ? (
//         <SelectedTile
//           item={{
//             ...selectedService,
//             price:
//               getServicePrice(
//                 selectedService.name,
//                 selectedCountry?.name ?? null,
//               ) ?? undefined,
//           }}
//           onCancel={() => setSelectedService(null)}
//           type="service"
//         />
//       ) : (
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Find website or app"
//             className="pl-10 dark:bg-boxdark"
//             value={serviceSearch}
//             onChange={(e) => setServiceSearch(e.target.value)}
//           />
//         </div>
//       )}

//       {loadingServices && <Loader2 height="200px" />}

//       {errorLoadingServices && !loadingServices && (
//         <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
//           <span>{t("actionsidebar.Error loading services")}</span>
//           <Button onClick={fetchServices} variant="outline" size="sm">
//             <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
//           </Button>
//         </div>
//       )}

//       {!selectedService && !loadingServices && (
//         <ScrollArea className="h-[300px] overflow-y-auto pr-4">
//           <div className="space-y-2">
//             {(showMore ? includedServices : mainServices).map(
//               (service: Service, index: number) => {
//                 const countrySpecificPrice = selectedCountry
//                   ? getServicePrice(service.name, selectedCountry.name)
//                   : null;
//                 return (
//                   <Button
//                     key={`${service.name}-${index}`}
//                     variant="ghost"
//                     className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     onClick={() => setSelectedService(service)}
//                   >
//                     <div className="flex items-center w-full">
//                       <Star
//                         className={`h-5 w-5 mr-2 ${
//                           favorites.services[service.name]
//                             ? 'text-yellow-400'
//                             : 'text-gray-400'
//                         } cursor-pointer`}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           toggleFavorite('services', service.name);
//                         }}
//                       />
                    
//                       <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
//                         {!imageError[service.name] ? (
//                           <img
//                             src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                             alt={`Icon of ${service.name}`}
//                             className="w-5 h-5 object-contain"
//                             onError={(e) => {
//                               setImageError((prev) => ({
//                                 ...prev,
//                                 [service.name]: true,
//                               }));
//                               const target = e.target as HTMLImageElement;
//                               target.onerror = null;
//                               target.src = ''; 
//                             }}
//                           />
//                         ) : (
//                           <HelpCircle className="w-5 h-5 text-blue-600" />
//                         )}
//                       </div>
//                       <span className="flex-grow">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</span>
//                       <span className="text-sm text-blue-500 dark:text-blue-400">Price:
//                         $
//                         {(countrySpecificPrice !== null
//                           ? countrySpecificPrice
//                           : service.price
//                         ).toFixed(2)}
//                       </span>
//                     </div>
//                   </Button>
//                 );
//               },
//             )}
//           </div>
//         </ScrollArea>
//       )}

//       {!selectedService && !loadingServices && (
//         <Button
//           onClick={() => setShowMore(!showMore)}
//           variant="link"
//           className="w-full text-blue-500 mt-2"
//         >
//           {showMore
//             ? `See Less (${mainServices.length}) services`
//             : `See More (${includedServices.length}) services`}
//         </Button>
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react'
import { Input } from './../ui/input'
import { Button } from './../ui/button'
import { ScrollArea } from './../ui/scrollarea'
import { Search, Star, RefreshCcw, HelpCircle } from 'lucide-react'
import  SelectedTile  from './SelectedTile'
import { Service, Country } from './types'
import  Loader2  from '../../../common/loader2'
import { useTranslation } from 'react-i18next'

interface ServiceSelectorProps {
  order: String
  selectedService: Service | null
  setSelectedService: (service: Service | null) => void
  services: Service[]
  serviceSearch: string
  setServiceSearch: (search: string) => void
  loadingServices: boolean
  errorLoadingServices: boolean
  fetchServices: () => void
  favorites: { services: Record<string, boolean> }
  toggleFavorite: (type: 'countries' | 'services', id: string) => void
  showMore: boolean
  setShowMore: (show: boolean) => void
  selectedCountry: Country | null
  getServicePrice: (serviceName: string, countryName: string | null) => number | null
  allPricingData: { [key: string]: number | null }
  getSuccessRate: (serviceName: string) => number | null
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  order,
  selectedService,
  setSelectedService,
  services,
  serviceSearch,
  setServiceSearch,
  loadingServices,
  errorLoadingServices,
  fetchServices,
  favorites,
  toggleFavorite,
  showMore,
  setShowMore,
  selectedCountry,
  getServicePrice,
  allPricingData,
  getSuccessRate,
}) => {
  const mainServices = services.filter((service) => service.main && service.isIncluded)
  const includedServices = services.filter((service) => service.isIncluded)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const { t } = useTranslation()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">{order+"." +t("actionsidebar.2.Select service")}</h2>
      {selectedService ? (
        <SelectedTile
          item={{
            ...selectedService,
            price: getServicePrice(selectedService.name, selectedCountry?.name ?? null) ?? undefined,
            successRate: getSuccessRate(selectedService.name),
          }}
          onCancel={() => setSelectedService(null)}
          type="service"
        />
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("actionsidebar.Find website or app")}
            className="pl-10 dark:bg-boxdark"
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
          />
        </div>
      )}

      {loadingServices && <Loader2 height={'200px'}  />}

      {errorLoadingServices && !loadingServices && (
        <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
          <span>{t("actionsidebar.Error loading services")}</span>
          <Button onClick={fetchServices} variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
          </Button>
        </div>
      )}

      {!selectedService && !loadingServices && (
        <ScrollArea className="h-[300px] overflow-y-auto p-4 bg-slate-50 dark:bg-boxdark-2">
          <div className="space-y-2">
            {(showMore ? includedServices : mainServices).map((service: Service, index: number) => {
              const countrySpecificPrice = selectedCountry
                ? getServicePrice(service.name, selectedCountry.name)
                : null
              const successRate = getSuccessRate(service.name)
              return (
                <Button
                  key={`${service.name}-${index}`}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedService(service)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.services[service.name] ? 'text-yellow-400' : 'text-gray-400'
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite('services', service.name)
                      }}
                    />
                    <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                      {!imageError[service.name] ? (
                        <img
                          src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
                          alt={`Icon of ${service.name}`}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            setImageError((prev) => ({
                              ...prev,
                              [service.name]: true,
                            }))
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = ''
                          }}
                        />
                      ) : (
                        <HelpCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <span className="flex-grow">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-blue-500 dark:text-blue-400">{t("actionsidebar.Price")}:
                        ${(countrySpecificPrice !== null ? countrySpecificPrice : service.price).toFixed(2)}
                      </span>
                      {successRate !== null && (
                        <span className="text-sm text-green-500 dark:text-green-400">{t("actionsidebar.Success")}:
                          {successRate.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </div>
                </Button>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {!selectedService && !loadingServices && (
        <Button
          onClick={() => setShowMore(!showMore)}
          variant="link"
          className="w-full text-blue-500 mt-2"
        >
          {showMore
            ? t("actionsidebar.See Less", { count: mainServices.length })
            : t("actionsidebar.See More", { count: includedServices.length })}
        </Button>
      )}
    </div>
  )
}