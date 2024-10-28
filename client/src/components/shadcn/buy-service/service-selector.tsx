import React, { useState } from 'react';
import { Input } from './../ui/input';
import { Button } from './../ui/button';
import { ScrollArea } from './../ui/scrollarea';
import { Search, Star, RefreshCcw, HelpCircle } from 'lucide-react';
import { SelectedTile } from './SelectedTile';
import { Service, Country } from './types';
import Loader2 from '../../../common/loader2';

interface ServiceSelectorProps {
  selectedService: Service | null;
  setSelectedService: (service: Service | null) => void;
  services: Service[];
  serviceSearch: string;
  setServiceSearch: (search: string) => void;
  loadingServices: boolean;
  errorLoadingServices: boolean;
  fetchServices: () => void;
  favorites: { services: Record<string, boolean> };
  toggleFavorite: (type: 'countries' | 'services', id: string) => void;
  showMore: boolean;
  setShowMore: (show: boolean) => void;
  selectedCountry: Country | null;
  getServicePrice: (
    serviceName: string,
    countryName: string | null,
  ) => number | null;
  allPricingData: { [key: string]: number | null };
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
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
}) => {
  const mainServices = services.filter(
    (service) => service.main && service.isIncluded,
  );
  const includedServices = services.filter((service) => service.isIncluded);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">2. Select service</h2>
      {selectedService ? (
        <SelectedTile
          item={{
            ...selectedService,
            price:
              getServicePrice(
                selectedService.name,
                selectedCountry?.name ?? null,
              ) ?? undefined,
          }}
          onCancel={() => setSelectedService(null)}
          type="service"
        />
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Find website or app"
            className="pl-10 dark:bg-boxdark"
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
          />
        </div>
      )}

      {loadingServices && <Loader2 height="200px" />}

      {errorLoadingServices && !loadingServices && (
        <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
          <span>Error loading services</span>
          <Button onClick={fetchServices} variant="outline" size="sm">
            <RefreshCcw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      )}

      {!selectedService && !loadingServices && (
        <ScrollArea className="h-[300px] overflow-y-auto pr-4">
          <div className="space-y-2">
            {(showMore ? includedServices : mainServices).map(
              (service: Service, index: number) => {
                const countrySpecificPrice = selectedCountry
                  ? getServicePrice(service.name, selectedCountry.name)
                  : null;
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
                          favorites.services[service.name]
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        } cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite('services', service.name);
                        }}
                      />
                      {/* <img
                      src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
                      alt={`Icon of ${service.name}`}
                      className="w-5 h-5 mr-2"
                      onError={(e) => {
                        setImageError((prev) => ({ ...prev, [service.name]: true }));
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '';
                        const errorIconContainer = document.createElement('div');
                        errorIconContainer.className = 'w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center';
                        const errorIcon = document.createElement('div');
                        errorIcon.innerHTML = '<HelpCircle className="w-3 h-3 text-gray-400" />';
                        errorIconContainer.appendChild(errorIcon);
                        target.replaceWith(errorIconContainer);
                      }}
                    />
                    {imageError[service.name] && (
                        <div className="  self-start ">
                        <HelpCircle className="w-5 h-5 text-gray-400" />
                      </div>
                    )} */}
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
                              }));
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = ''; // Clear the source to prevent looping
                            }}
                          />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <span className="flex-grow">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</span>
                      <span className="text-sm text-blue-500 dark:text-blue-400">Price:
                        $
                        {(countrySpecificPrice !== null
                          ? countrySpecificPrice
                          : service.price
                        ).toFixed(2)}
                      </span>
                    </div>
                  </Button>
                );
              },
            )}
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
            ? `See Less (${mainServices.length}) services`
            : `See More (${includedServices.length}) services`}
        </Button>
      )}
    </div>
  );
};

// //65555555555555555555555555555555555555555
// // import React from 'react';
// // import { Input } from './../ui/input';
// // import { Button } from './../ui/button';
// // import { ScrollArea } from './../ui/scrollarea';
// // import { Search, Star, RefreshCcw, HelpCircle } from 'lucide-react';
// // import { SelectedTile } from './SelectedTile';
// // import { Service, Country } from './types';
// // import Loader2 from '../../../common/loader2';

// // interface ServiceSelectorProps {
// //   selectedService: Service | null;
// //   setSelectedService: (service: Service | null) => void;
// //   services: Service[];
// //   serviceSearch: string;
// //   setServiceSearch: (search: string) => void;
// //   loadingServices: boolean;
// //   errorLoadingServices: boolean;
// //   fetchServices: () => void;
// //   favorites: { services: Record<string, boolean> };
// //   toggleFavorite: (type: 'countries' | 'services', id: string) => void;
// //   showMore: boolean;
// //   setShowMore: (show: boolean) => void;
// //   selectedCountry: Country | null;
// //   getServicePrice: (serviceName: string, countryName: string | null) => number | null;
// //   allPricingData: { [key: string]: number | null };
// // }

// // export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
// //   selectedService,
// //   setSelectedService,
// //   services,
// //   serviceSearch,
// //   setServiceSearch,
// //   loadingServices,
// //   errorLoadingServices,
// //   fetchServices,
// //   favorites,
// //   toggleFavorite,
// //   showMore,
// //   setShowMore,
// //   selectedCountry,
// //   getServicePrice,
// //   allPricingData,
// // }) => {
// //   const mainServices = services.filter((service) => service.main && service.isIncluded);
// //   const includedServices = services.filter((service) => service.isIncluded);

// //   return (
// //     <div className="p-4 space-y-4">
// //       <h2 className="text-lg font-semibold">2. Select service</h2>
// //       {selectedService ? (
// //         <SelectedTile
// //           item={{
// //             ...selectedService,
// //             price: getServicePrice(selectedService.name, selectedCountry?.name ?? null) ?? undefined,
// //           }}
// //           onCancel={() => setSelectedService(null)}
// //           type="service"
// //         />
// //       ) : (
// //         <div className="relative">
// //           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
// //           <Input
// //             placeholder="Find website or app"
// //             className="pl-10 dark:bg-boxdark"
// //             value={serviceSearch}
// //             onChange={(e) => setServiceSearch(e.target.value)}
// //           />
// //         </div>
// //       )}

// //       {loadingServices && <Loader2 height="200px" />}

// //       {errorLoadingServices && !loadingServices && (
// //         <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
// //           <span>Error loading services</span>
// //           <Button onClick={fetchServices} variant="outline" size="sm">
// //             <RefreshCcw className="w-4 h-4 mr-2" /> Retry
// //           </Button>
// //         </div>
// //       )}

// //       {!selectedService && !loadingServices && (
// //         <ScrollArea className="h-[300px] overflow-y-auto pr-4">
// //           <div className="space-y-2">
// //             {(showMore ? includedServices : mainServices).map((service, index) => {
// //               const countrySpecificPrice = selectedCountry
// //                 ? getServicePrice(service.name, selectedCountry.name)
// //                 : null;
// //               return (
// //                 <Button
// //                   key={`${service.name}-${index}`}
// //                   variant="ghost"
// //                   className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
// //                   onClick={() => setSelectedService(service)}
// //                 >
// //                   <div className="flex items-center w-full">
// //                     <Star
// //                       className={`h-5 w-5 mr-2 ${
// //                         favorites.services[service.name] ? 'text-yellow-400' : 'text-gray-400'
// //                       } cursor-pointer`}
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         toggleFavorite('services', service.name);
// //                       }}
// //                     />
// //                     <div className="w-5 h-5 mr-2 flex items-center justify-center">
// //                       {service.name ? (
// //                         <img
// //                           src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
// //                           alt={`Icon of ${service.name}`}
// //                           className="w-5 h-5"
// //                           onError={(e) => {
// //                             e.currentTarget.onerror = null;
// //                             e.currentTarget.src = '';
// //                             e.currentTarget.replaceWith(document.createElement('div'));
// //                             if (e.currentTarget.parentElement) {
// //                               e.currentTarget.parentElement.innerHTML = '<div class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
// //                             }
// //                           }}
// //                         />
// //                       ) : (
// //                         <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
// //                           <HelpCircle className="w-3 h-3 text-gray-400" />
// //                         </div>
// //                       )}
// //                     </div>
// //                     <span className="flex-grow">{service.name}</span>
// //                     <span className="text-sm text-blue-500 dark:text-blue-400">
// //                       ${(countrySpecificPrice !== null ? countrySpecificPrice : service.price).toFixed(2)}
// //                     </span>
// //                     {selectedCountry && (
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         className="ml-2 text-xs"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           // Implement buy functionality here
// //                         }}
// //                       >
// //                         Buy
// //                       </Button>
// //                     )}
// //                   </div>
// //                 </Button>
// //               );
// //             })}
// //           </div>
// //         </ScrollArea>
// //       )}

// //       {!selectedService && !loadingServices && (
// //         <Button
// //           onClick={() => setShowMore(!showMore)}
// //           variant="link"
// //           className="w-full text-blue-500 mt-2"
// //         >
// //           {showMore
// //             ? `See Less (${mainServices.length}) services`
// //             : `See More (${includedServices.length}) services`}
// //         </Button>
// //       )}
// //     </div>
// //   );
// // };
// //888888888888888888
// import React from 'react';
// import { Input } from './../ui/input';
// import { Button } from './../ui/button';
// import { ScrollArea } from './../ui/scrollarea';
// import { Search, Star, RefreshCcw, HelpCircle, ShoppingCart } from 'lucide-react';
// import { SelectedTile } from './SelectedTile';
// import { Service, Country } from './types';
// import Loader2 from '../../../common/loader2';

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
//   getServicePrice: (serviceName: string, countryName: string | null) => number | null;
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
//   const mainServices = services.filter((service) => service.main && service.isIncluded);
//   const includedServices = services.filter((service) => service.isIncluded);

//   return (
//     <div className="p-4 space-y-4">
//       <h2 className="text-lg font-semibold">2. Select service</h2>
//       {selectedService ? (
//         <SelectedTile
//           item={{
//             ...selectedService,
//             price: getServicePrice(selectedService.name, selectedCountry?.name ?? null) ?? undefined,
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
//           <span>Error loading services</span>
//           <Button onClick={fetchServices} variant="outline" size="sm">
//             <RefreshCcw className="w-4 h-4 mr-2" /> Retry
//           </Button>
//         </div>
//       )}

//       {!selectedService && !loadingServices && (
//         <ScrollArea className="h-[300px] overflow-y-auto pr-4">
//           <div className="space-y-2">
//             {(showMore ? includedServices : mainServices).map((service, index) => {
//               const countrySpecificPrice = selectedCountry
//                 ? getServicePrice(service.name, selectedCountry.name)
//                 : null;
//               return (
//                 <Button
//                   key={`${service.name}-${index}`}
//                   variant="ghost"
//                   className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => setSelectedService(service)}
//                 >
//                   <div className="flex items-center w-full">
//                     <Star
//                       className={`h-5 w-5 mr-2 ${
//                         favorites.services[service.name] ? 'text-yellow-400' : 'text-gray-400'
//                       } cursor-pointer`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleFavorite('services', service.name);
//                       }}
//                     />
//                     <div className="w-5 h-5 mr-2 flex items-center justify-center">
//                       {service.name ? (
//                         <img
//                           src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                           alt={`Icon of ${service.name}`}
//                           className="w-5 h-5"
//                           onError={(e) => {
//                             e.currentTarget.onerror = null;
//                             e.currentTarget.style.display = 'none';
//                             if (e.currentTarget.parentElement) {
//                               e.currentTarget.parentElement.innerHTML = '<div class="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"><svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>';
//                             }
//                           }}
//                         />
//                       ) : (
//                         <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
//                           {/* <HelpCircle className="w-3 h-10 text-gray-400" /> */}
//                         </div>
//                       )}
//                     </div>
//                     <span className="flex-grow">{service.name}</span>
//                     <span className="text-sm text-blue-500 dark:text-blue-400">price:
//                       ${(countrySpecificPrice !== null ? countrySpecificPrice : service.price).toFixed(2)}
//                     </span>
//                     {/* {selectedCountry && (
//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="ml-2"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           // Implement buy functionality here
//                         }}
//                       >
//                         <ShoppingCart className="h-4 w-4" />
//                       </Button>
//                     )} */}
//                   </div>
//                 </Button>
//               );
//             })}
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
