// import { useState, useMemo, useEffect } from 'react';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { ScrollArea } from './ui/scrollarea';
// import { Search, Star, X, RefreshCcw, HelpCircle } from 'lucide-react';
// import Logo from '../../images/logo/logo-placeholder.svg';
// import axios from 'axios';
// import { useAuth } from '../../contexts/authcontext';
// import {
//   collection,
//   count,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   setDoc,
//   where,
// } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useNavigate } from 'react-router-dom';
// import { ToastAction } from './ui/toast';
// import { toast } from './ui/use-toast';
// import Loader from '../../common/Loader';
// import Loader2 from '../../common/loader2';
// import React from 'react';

// interface Country {
//   iso: string;
//   name: string;
//   prefix: string;
// }

// interface Service {
//   name: string;
//   icon: string;
// }

// interface Operator {
//   name: string;
//   cost: number;
//   count: number;
// }

// interface SelectedTileProps {
//   item: Country | Service | Operator;
//   onCancel: () => void;
//   type: 'country' | 'service' | 'operator';
//   iso: String;
// }

// const servicesData: Record<string, Service> = {
//   whatsapp: { name: 'WhatsApp', icon: 'whatsapp' },
//   telegram: { name: 'Telegram', icon: 'telegram' },
//   facebook: { name: 'Facebook', icon: 'facebook' },
//   instagram: { name: 'Instagram', icon: 'instagram' },
//   google: { name: 'Google', icon: 'google' },
//   amazon: { name: 'Amazon', icon: 'amazon' },
// };

// // const SelectedTile: React.FC<SelectedTileProps> = ({
// //   item,
// //   onCancel,
// //   type,
// //   iso
// // }) => (
// //   <div className="flex items-center dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-between bg-gray-100 p-2 rounded-md">
// //     <div className="flex items-center">
// //       <img
// //         src={`https://logo.clearbit.com/${item.name.toLowerCase()}.com`}
// //         src={`https://flagcdn.com/w20/${iso.toLowerCase()}.png`}
        
// //         alt={
// //           type === 'country' ? `Flag of ${item.name}` : `Icon of ${item.name}`
// //         }
// //         className={
// //           type === 'country'
// //             ? `flags flags-${item as Country}`
// //             : `products products-${(item as Service).icon}`
// //         }
// //         width={20}
// //         height={20}
// //       />
// //       <span className="ml-2">{item.name}</span>
// //     </div>
// //     <Button variant="ghost" size="sm" onClick={onCancel}>
// //       <X className="h-4 w-4" />
// //     </Button>
// //   </div>
// // );
// const SelectedTile: React.FC<SelectedTileProps> = ({
//   item,
//   onCancel,
//   type,
//   iso
// }) => {
//   const [imageError, setImageError] = React.useState(false);

//   const getImageSrc = () => {
//     if (type === 'country') {
//       return `https://flagcdn.com/w20/${iso.toLowerCase()}.png`;
//     } else {
//       return `https://logo.clearbit.com/${item.name.toLowerCase()}.com`;
//       // return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${item.name.toLowerCase()}.svg`;
//     }
//   };

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   return (
//     <div className="flex items-center dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-between bg-gray-100 p-2 rounded-md">
//       <div className="flex items-center">
//         {!imageError ? (
//           <img
//             src={getImageSrc()}
//             alt={type === 'country' ? `Flag of ${item.name}` : `Icon of ${item.name}`}
//             className={type === 'country' ? `flags flags-${iso}` : 'products'}
//             width={20}
//             height={20}
//             onError={handleImageError}
//           />
//         ) : (
//           <div className="w-5 h-5 flex items-center justify-center">
//             <HelpCircle className="h-5 w-5 text-gray-400" />
//           </div>
//         )}
//         <span className="ml-2">{item.name}</span>
//       </div>
//       <Button variant="ghost" size="sm" onClick={onCancel}>
//         <X className="h-4 w-4" />
//       </Button>
//     </div>
//   );
// };
// export const ChooseService: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [countries, setCountries] = useState<
//     { name: string; iso: string; prefix: string }[]
//   >([]);
//   const [services, setServices] = useState<any[]>([]);
//   // create a state for filtered countries and services
//   const [filteredCountries, setFilteredCountries] = useState<
//     { name: string; iso: string; prefix: string }[]
//   >([]);
//   const [filteredServices, setFilteredServices] = useState<any[]>([]);
//   const [operators, setOperators] = useState<any[]>([]);

//   const [countrySearch, setCountrySearch] = useState('');
//   const [serviceSearch, setServiceSearch] = useState('');
//   const [operatorSearch, setOperatorSearch] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
//     null,
//   );
//   const [favorites, setFavorites] = useState<{
//     countries: Record<string, boolean>;
//     services: Record<string, boolean>;
//     operators: Record<string, boolean>;
//   }>({
//     countries: {},
//     services: {},
//     operators: {},
//   });

//   //under const

//   const [showMore, setShowMore] = useState(false);
//   const mainServices = filteredServices.filter(
//     (service) => service.main && service.isIncluded,
//   );
//   const includedServices = filteredServices.filter(
//     (service) => service.isIncluded,
//   );

//   const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({});
// const [loadingPricing, setLoadingPricing] = useState(true);

// const fetchAllPricing = async () => {
//   try {
//     const pricingCollectionRef = collection(db, 'pricing');
//     const querySnapshot = await getDocs(pricingCollectionRef);

//     const pricingData: { [key: string]: number | null } = {};
//     querySnapshot.forEach((doc) => {
//       const { price } = doc.data();
//       pricingData[doc.id] = price; // The document ID format should be "countryname_servicename"
//     });

//     setAllPricingData(pricingData);
//     setLoadingPricing(false);
//   } catch (error) {
//     console.error('Error fetching pricing data', error);
//     setLoadingPricing(false);
//   }
// };

// // Fetch pricing data when the component mounts
// useEffect(() => {
//   fetchAllPricing();
// }, []);


// const getServicePrice = (serviceName: string, countryName: string | null): number | null => {
//   if (countryName) {
//     const countryServiceKey = `${countryName.toLowerCase()}_${serviceName.toLowerCase()}`;
//     return allPricingData[countryServiceKey] ?? null; // Use the pricing data if found, else return null
//   }
//   return null;
// };


//   //dont pas

//   const [loadingCountries, setLoadingCountries] = useState(true);
//   const [loadingServices, setLoadingServices] = useState(true);
//   const [erroLoadingCountries, setErrorLoadingCountries] = useState(false);
//   const [errorLoadingServices, setErrorLoadingServices] = useState(false);
//   const [failedToBuy, setFailedToBuy] = useState(false);
//   const [buying, setBuying] = useState(false);

//   const [countryLoaded, setCountryLoaded] = useState(false);
//   const [serviceLoaded, setServiceLoaded] = useState(false);

//   useEffect(() => {
//     fetchCountries();
//     fetchServices();
//   }, []);

//   // Fetch services

//   const fetchCountries = async () => {
//     setLoadingCountries(true);
//     console.log('Fetching countries from Firestore...');
//     try {
//       // Reference the 'countries' collection
//       const countriesCollectionRef = collection(db, 'countries');

//       // Query Firestore to get countries where 'included' is true
//       const q = query(countriesCollectionRef, where('included', '==', true));
//       const querySnapshot = await getDocs(q);

//       // Format the fetched countries
//       const formattedCountries = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         iso: doc.data().iso,
//         prefix: doc.data().prefix,
//       }));

//       setCountries(formattedCountries); // Set state with formatted countries
//       setLoadingCountries(false);
//       setCountryLoaded(true);
//       console.log('Formatted Countries from Firestore:', formattedCountries);
//     } catch (error) {
//       setErrorLoadingCountries(true);
//       setLoadingCountries(false);
//       console.error('Error fetching countries from Firestore:', error);
//     }
//   };

//   const buyProduct = async () => {
//     setBuying(true);
//     setFailedToBuy(false);
//     console.log('buying product');
//     const country = selectedCountry?.name.toLowerCase();
//     const product = selectedService?.name.toLowerCase();

//     console.log('buying product', country, product);

//     try {
//       const response = await axios.post(
//         'https://smsverify-server.vercel.app/api/buy-product',
//         {
//           uid: currentUser?.uid,
//           country,

//           product,
//         },
//       );

//       const id = response.data?.product?.id ?? null;

//       // Reset the selected states
//       setSelectedCountry(null);
//       setSelectedService(null);
//       setSelectedOperator(null);

//       // Navigate to the SMS page

//       // Success toast notification
//       toast({
//         variant: 'success',
//         title: 'Product purchased successfully',
//         description:
//           'You can now use the service.Refresh page to see the changes.',
//       });
//       navigate(`/sms?id=${id}`);
//       setBuying(false);

//       // console.log('Purchase response:', response.data);
//     } catch (error: any) {
//       // Handle different error types
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           // Insufficient balance toast
//           toast({
//             variant: 'destructive',
//             title: 'Insufficient balance',
//             description: 'Please top up your account to complete the purchase.',
//             action: (
//               <ToastAction
//                 onClick={() => navigate('/pay')}
//                 altText="Go to payment"
//               >
//                 Go to Payment
//               </ToastAction>
//             ),
//           });
//         } else {
//           // General Axios error
//           toast({
//             variant: 'destructive',
//             title: 'Purchase failed',
//             description: 'Something went wrong while purchasing the product.',
//           });
//           setFailedToBuy(true);
//           setBuying(false);
//         }
//       } else {
//         setFailedToBuy(true);
//         setBuying(false);
//         // Non-Axios or unknown errors
//         toast({
//           variant: 'destructive',
//           title: 'Unknown error',
//           description: 'An unknown error occurred. Please try again.',
//           action: (
//             <ToastAction onClick={buyProduct} altText="Try again">
//               Try again
//             </ToastAction>
//           ),
//         });
//       }
//       setFailedToBuy(true);
//       setBuying(false);
//       console.error('Error purchasing product:', error);
//     }
//   };
//   //fetching services

//   const fetchServices = async () => {
//     setLoadingServices(true);
//     console.log('Fetching services from Firestore...');

//     try {
//       // Reference to the 'services' collection
//       const servicesCollectionRef = collection(db, 'services');

//       // Query Firestore to get all services
//       const querySnapshot = await getDocs(servicesCollectionRef);

//       // Format the fetched services
//       const formattedServices = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         category: doc.data().category,
//         quantity: doc.data().quantity,
//         price: doc.data().price,
//         main: doc.data().main || false, // 'main' field if it exists
//         isIncluded: doc.data().isIncluded || false, // 'isIncluded' field if it exists
//       }));

//       setServices(formattedServices); // Set state with formatted services
//       setLoadingServices(false);
//       setFilteredServices(formattedServices);
//       setServiceLoaded(true);
//       // console.log('Formatted Services from Firestore:', formattedServices);
//     } catch (error) {
//       setLoadingServices(false);
//       setErrorLoadingServices(true);
//       console.error('Failed to fetch services from Firestore', error);
//     }
//   };

//   const fetchOperator = async () => {
//     const lowercaseCountry = (selectedCountry?.name as string).toLowerCase();
//     const lowercaseService = (selectedService?.name as string).toLowerCase();
//     console.log(
//       'operators,, are coming',
//       selectedCountry?.name,
//       selectedService?.name,
//     );
//     try {
//       const response = await fetch(
//         `https://smsverify-server.vercel.app/api/get-operators?country=${lowercaseCountry}&service=${lowercaseService}`,
//       );
//       if (!response.ok) {
//         throw new Error('Failed to fetch operators.');
//       }

//       const data = await response.json();
//       console.log('response data', data);

//       // Format operators to an array from the nested object structure
//       const formattedOperators = Object.entries(
//         data[lowercaseCountry][lowercaseService],
//       ).map(([name, details]: [string, any]) => ({
//         name, // e.g., 'beeline', 'matrix', etc.
//         cost: details.cost,
//         count: details.count,
//         rate: details.rate ?? 0, // Make rate optional with a default value of 0
//       }));

//       setOperators(formattedOperators);
//     } catch (err: any) {
//       console.log(err.message);
//     } finally {
//       // Optionally handle loading state
//     }
//   };

//   useEffect(() => {
//     setFilteredCountries(
//       countries.filter((country) =>
//         country.name.toLowerCase().includes(countrySearch.toLowerCase()),
//       ),
//     );
//   }, [countries, countrySearch]);

//   useEffect(() => {
//     setFilteredServices(
//       services.filter((service) =>
//         service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
//       ),
//     );
//   }, [services, serviceSearch]);

//   const handleCountrySelect = (country: Country) => {
//     setSelectedCountry(country);
//     setSelectedOperator(null);
//     setCountrySearch('');
//   };

//   const handleServiceSelect = (service: Service) => {
//     setSelectedService(service);
//     setSelectedOperator(null);
//     setServiceSearch('');
//   };

//   // const handleOperatorSelect = (operator: Operator) => {
//   //   setSelectedOperator(operator);
//   //   setOperatorSearch('');
//   // };

//   const handleCountryCancel = () => {
//     setSelectedCountry(null);
//     setSelectedOperator(null);
//     setCountrySearch('');
//     setOperatorSearch('');
//   };

//   const handleServiceCancel = () => {
//     setSelectedService(null);
//     setSelectedOperator(null);
//     setServiceSearch('');
//     setOperatorSearch('');
//   };

//   const handleOperatorCancel = () => {
//     setSelectedOperator(null);
//     setOperatorSearch('');
//   };

//   const toggleFavorite = (
//     type: 'countries' | 'services' | 'operators',
//     id: string,
//   ) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [id]: !prev[type][id],
//       },
//     }));
//   };

//   return (
//     <div className="flex dark:bg-boxdark-2 min-w-full  rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
//       <div className="p-4 ">
//         <h2 className="text-lg font-semibold mb-4">1. Select country</h2>
//         {selectedCountry ? (
//           <SelectedTile
//             item={selectedCountry}
//             onCancel={handleCountryCancel}
//             type="country"
//             iso={selectedCountry.iso}
//           />
//         ) : (
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark" />
//             <Input
//               placeholder="Find country"
//               className="pl-8 dark:bg-boxdark"
//               value={countrySearch}
//               onChange={(e) => setCountrySearch(e.target.value)}
//             />
//           </div>
//         )}
//       </div>

//       {loadingCountries && <Loader2 height="200px"></Loader2>}

//       {erroLoadingCountries && !loadingCountries && !countryLoaded && (
//         <div className="bg-white  dark:bg-boxdark border-red-20 rounded p-4 flex flex-row gap-4 ">
//           <span>Error loading countries,Refresh</span>{' '}
//           <RefreshCcw onClick={fetchCountries}></RefreshCcw>{' '}
//         </div>
//       )}

//       {!selectedCountry && !loadingCountries && (
//         <div className="h-[300px] overflow-hidden">
//           <ScrollArea className="h-full">
//             <div className="p-4 space-y-2">
//               {filteredCountries.map((country, index) => (
//                 <Button
//                   key={`${country.iso}-${index}`}
//                   variant="ghost"
//                   className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
//                   onClick={() => handleCountrySelect(country)}
//                 >
//                   <div className="flex items-center w-full">
//                     <Star
//                       className={`h-5 w-5 mr-2 ${
//                         favorites.countries[country.name]
//                           ? 'text-yellow-400'
//                           : 'text-gray-400'
//                       } cursor-pointer`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         toggleFavorite('countries', country.name);
//                       }}
//                     />

//                     <img
//                       src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`} // Using the ISO code
//                       alt={`Flag of ${country.name}`}
//                       className={`flags flags-${country.iso} mr-2`}
//                       width={20}
//                       height={20}
//                     />

//                     <span>{country.name}</span>
//                   </div>
//                 </Button>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       )}
//       <div className="p-4">
//         <h2 className="text-lg font-semibold mb-4">2. Select service</h2>
//         {selectedService ? (
//           <SelectedTile
//             item={selectedService}
//             onCancel={handleServiceCancel}
//             type="service" iso={''}          />
//         ) : (
//           <div className="relative">
//             <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Find website or app"
//               className="pl-8 dark:bg-boxdark"
//               value={serviceSearch}
//               onChange={(e) => setServiceSearch(e.target.value)}
//             />
//           </div>
//         )}
//       </div>

//       {loadingServices && <Loader2 height="200px" />}

//       {errorLoadingServices && !loadingServices && !serviceLoaded && (
//         <div className="bg-white dark:bg-boxdark border-red-20 rounded p-4 flex flex-row gap-4">
//           <span>Error loading services, refresh</span>
//           <RefreshCcw onClick={fetchServices} />
//         </div>
//       )}

//       {/* Main Services */}
//       {!showMore && !selectedService && !loadingServices && (
//         <div className="space-y-2">
//           {mainServices.map((service, index) => {
//             const countrySpecificPrice = selectedCountry
//               ? getServicePrice(service.name, selectedCountry.name)
//               : null;
//             return (
//               <Button
//                 key={`${service.name}-${index}`}
//                 variant="ghost"
//                 className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
//                 onClick={() => handleServiceSelect(service)}
//               >
//                 <div className="flex items-center w-full">
//                   <Star
//                     className={`h-5 w-5 mr-2 ${
//                       favorites.services[service.icon]
//                         ? 'text-yellow-400 '
//                         : 'text-gray-400'
//                     } cursor-pointer`}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite('services', service.icon);
//                     }}
//                   />
//                   <img
//                     src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                     // src={`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${service.name.toLowerCase()}.svg`}
//                     alt={`Icon of ${service.name}`}
//                     className="mr-2 text-blue-400"
//                     width={20}
//                     height={20}
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.onerror = null;
//                       target.src = '';
//                       target.replaceWith(document.createTextNode(''));
//                     }}
//                   />
//                   <div className="flex flex-row justify-end">
//                     <span className="mr-6">{service.name}</span>
//                     <div className="flex flex-col">
//                       <span className="text-md text-blue-300">
//                         price {countrySpecificPrice !== null ? countrySpecificPrice : service.price}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </Button>
//             );
//           })}
//         </div>
//       )}

//       {/* Show more/less button */}
//       {!selectedService && !loadingServices && (
//         <>
//           {showMore && (
//             <div className="h-[300px] overflow-hidden">
//               <ScrollArea className="h-full">
//                 <div className="p-4 space-y-2">
//                   {includedServices.map((service, index) => {
//                     const countrySpecificPrice = selectedCountry
//                       ? getServicePrice(service.name, selectedCountry.name)
//                       : null;
//                     return (
//                       <Button
//                         key={`${service.name}-${index}`}
//                         variant="ghost"
//                         className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
//                         onClick={() => handleServiceSelect(service)}
//                       >
//                         <div className="flex items-center w-full">
//                           <Star
//                             className={`h-5 w-5 mr-2 ${
//                               favorites.services[service.icon]
//                                 ? 'text-yellow-400 '
//                                 : 'text-gray-400'
//                             } cursor-pointer`}
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               toggleFavorite('services', service.icon);
//                             }}
//                           />
//                           <img
//                             // src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                             src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                             alt={`Icon of ${service.name}`}
//                             className="mr-2"
//                             width={20}
//                             height={20}
//                             onError={(e) => {
//                               const target = e.target as HTMLImageElement;
//                               target.onerror = null;
//                               target.src = '';
//                               target.replaceWith(document.createTextNode(''));
//                             }}
//                           />
//                           <div className="flex flex-row justify-end">
//                             <span className="mr-6">{service.name}</span>
//                             <div className="flex flex-col">
//                               <span className="text-md text-blue-300">
//                                 price {countrySpecificPrice !== null ? countrySpecificPrice : service.price}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </Button>
//                     );
//                   })}
//                 </div>
//               </ScrollArea>
//             </div>
//           )}
//           <button
//             onClick={() => setShowMore(!showMore)}
//             className="text-blue-500 mt-4"
//           >
//             {showMore
//               ? `See Less (${mainServices.length}) services`
//               : `See More (${includedServices.length}) services`}
//           </button>
//         </>
//       )}

//       {/* change it back to the above */}

//       <div className="p-4">
//         {buying && !failedToBuy && <Loader2 height="20px"></Loader2>}
//         {!buying && (
//           <Button
//             onClick={buyProduct}
//             className="w-full "
//             disabled={!selectedCountry || !selectedService}
//           >
//             {failedToBuy && !buying && (
//               <span className="text-whiten">Retry</span>
//             )}
//             {!failedToBuy && !buying && (
//               <span className="text-whiten">Buy number</span>
//             )}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };




import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scrollarea';
import { RefreshCcw, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from './ui/toast';
import { toast } from './ui/use-toast';
import Loader2 from '../../common/loader2';
import { CountrySelector } from './buy-service/country-selector';
import { ServiceSelector } from './buy-service/service-selector';
import { SelectedTile } from './buy-service/SelectedTile';
import { Country, Service, Operator } from './buy-service/types';
import { fetchAllPricing, getServicePrice } from './buy-service/utils';

export const ChooseService: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);

  const [countrySearch, setCountrySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
  }>(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} };
  });

  const [showMore, setShowMore] = useState(false);
  const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({});
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorLoadingCountries, setErrorLoadingCountries] = useState(false);
  const [errorLoadingServices, setErrorLoadingServices] = useState(false);
  const [failedToBuy, setFailedToBuy] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchCountries();
    fetchServices();
    fetchAllPricing().then(setAllPricingData).finally(() => setLoadingPricing(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const countriesCollectionRef = collection(db, 'countries');
      const q = query(countriesCollectionRef, where('included', '==', true));
      const querySnapshot = await getDocs(q);
      const formattedCountries = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        iso: doc.data().iso,
        prefix: doc.data().prefix,
      }));
      setCountries(formattedCountries);
      setFilteredCountries(formattedCountries);
    } catch (error) {
      setErrorLoadingCountries(true);
      console.error('Error fetching countries from Firestore:', error);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const servicesCollectionRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesCollectionRef);
      const formattedServices = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        category: doc.data().category,
        quantity: doc.data().quantity,
        price: doc.data().price,
        main: doc.data().main || false,
        isIncluded: doc.data().isIncluded || false,
      }));
      setServices(formattedServices);
      setFilteredServices(formattedServices);
    } catch (error) {
      setErrorLoadingServices(true);
      console.error('Failed to fetch services from Firestore', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const buyProduct = async () => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to purchase a product.',
        action: (
          <ToastAction onClick={() => navigate('/auth/signin')} altText="Go to login">
            Go to Login
          </ToastAction>
        ),
      });
      return;
    }

    setBuying(true);
    setFailedToBuy(false);
    const country = selectedCountry?.name.toLowerCase();
    const product = selectedService?.name.toLowerCase();

    try {
      const response = await axios.post('https://smsverify-server.vercel.app/api/buy-product', {
        uid: currentUser.uid,
        country,
        product,
      });

      const id = response.data?.product?.id ?? null;

      setSelectedCountry(null);
      setSelectedService(null);
      setSelectedOperator(null);

      toast({
        variant: 'success',
        title: 'Product purchased successfully',
        description: 'You can now use the service. Refresh page to see the changes.',
      });
      navigate(`/sms?id=${id}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: 'Insufficient balance',
            description: 'Please top up your account to complete the purchase.',
            action: (
              <ToastAction onClick={() => navigate('/pay')} altText="Go to payment">
                Go to Payment
              </ToastAction>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Purchase failed',
            description: 'Something went wrong while purchasing the product.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Unknown error',
          description: 'An unknown error occurred. Please try again.',
          action: (
            <ToastAction onClick={buyProduct} altText="Try again">
              Try again
            </ToastAction>
          ),
        });
      }
      setFailedToBuy(true);
    } finally {
      setBuying(false);
    }
  };

  const toggleFavorite = (type: 'countries' | 'services', id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));
  };

  return (
    <div className="flex dark:bg-boxdark-2 min-w-full rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
      <CountrySelector
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={filteredCountries}
        countrySearch={countrySearch}
        setCountrySearch={setCountrySearch}
        loadingCountries={loadingCountries}
        errorLoadingCountries={errorLoadingCountries}
        fetchCountries={fetchCountries}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />

      <ServiceSelector
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        services={filteredServices}
        serviceSearch={serviceSearch}
        setServiceSearch={setServiceSearch}
        loadingServices={loadingServices}
        errorLoadingServices={errorLoadingServices}
        fetchServices={fetchServices}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        showMore={showMore}
        setShowMore={setShowMore}
        selectedCountry={selectedCountry}
        getServicePrice={(serviceName, countryName) => getServicePrice(serviceName, countryName, allPricingData)}
        allPricingData={allPricingData}
      />

      <div className="p-4">
        {buying && !failedToBuy && <Loader2 height="20px" />}
        {!buying && (
          <Button
            onClick={buyProduct}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            disabled={!selectedCountry || !selectedService}
          ><ShoppingCart className="w-5 h-5" />
            {failedToBuy && !buying && <span>Retry</span>}
            {!failedToBuy && !buying && <span>Buy number</span>}
          </Button>



          
        )}
      </div>
    </div>
  );
};




// import { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { ScrollArea } from './ui/scrollarea';
// import { RefreshCcw, ShoppingCart } from 'lucide-react';
// import axios from 'axios';
// import { useAuth } from '../../contexts/authcontext';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useNavigate } from 'react-router-dom';
// import { ToastAction } from './ui/toast';
// import { toast } from './ui/use-toast';
// import Loader2 from '../../common/loader2';
// import { CountrySelector } from './buy-service/country-selector';
// import { ServiceSelector } from './buy-service/service-selector';
// import { SelectedTile } from './buy-service/SelectedTile';
// import { Country, Service, Operator } from './buy-service/types';
// import { fetchAllPricing, getServicePrice } from './buy-service/utils';

// interface ServiceSelectorProps {
//   selectedService: Service | null;
//   setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
//   services: Service[];
//   serviceSearch: string;
//   setServiceSearch: React.Dispatch<React.SetStateAction<string>>;
//   loadingServices: boolean;
//   errorLoadingServices: boolean;
//   fetchServices: () => Promise<void>;
//   favorites: {
//     countries: Record<string, boolean>;
//     services: Record<string, boolean>;
//   };
//   toggleFavorite: (type: 'countries' | 'services', id: string) => void;
//   showMore: boolean;
//   setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedCountry: Country | null;
//   getServicePrice: (serviceName: string, countryName: string | null, allPricingData: { [key: string]: number | null }) => number | null;
//   allPricingData: { [key: string]: number | null };
// }

// export const ChooseService: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
//   const [filteredServices, setFilteredServices] = useState<Service[]>([]);
//   const [operators, setOperators] = useState<Operator[]>([]);

//   const [countrySearch, setCountrySearch] = useState('');
//   const [serviceSearch, setServiceSearch] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
//   const [favorites, setFavorites] = useState<{
//     countries: Record<string, boolean>;
//     services: Record<string, boolean>;
//   }>(() => {
//     const storedFavorites = localStorage.getItem('favorites');
//     return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} };
//   });

//   const [showMore, setShowMore] = useState(false);
//   const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({});
//   const [loadingPricing, setLoadingPricing] = useState(true);
//   const [loadingCountries, setLoadingCountries] = useState(true);
//   const [loadingServices, setLoadingServices] = useState(true);
//   const [errorLoadingCountries, setErrorLoadingCountries] = useState(false);
//   const [errorLoadingServices, setErrorLoadingServices] = useState(false);
//   const [failedToBuy, setFailedToBuy] = useState(false);
//   const [buying, setBuying] = useState(false);
//   const [currentPrice, setCurrentPrice] = useState<number | null>(null);

//   useEffect(() => {
//     fetchCountries();
//     fetchServices();
//     fetchAllPricing().then(setAllPricingData).finally(() => setLoadingPricing(false));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }, [favorites]);

//   useEffect(() => {
//     if (selectedService && selectedCountry) {
//       const price = getServicePrice(selectedService.name, selectedCountry.name, allPricingData);
//       setCurrentPrice(price !== null ? price : selectedService.price);
//     } else {
//       setCurrentPrice(null);
//     }
//   }, [selectedService, selectedCountry, allPricingData]);

//   const fetchCountries = async () => {
//     setLoadingCountries(true);
//     try {
//       const countriesCollectionRef = collection(db, 'countries');
//       const q = query(countriesCollectionRef, where('included', '==', true));
//       const querySnapshot = await getDocs(q);
//       const formattedCountries = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         iso: doc.data().iso,
//         prefix: doc.data().prefix,
//       }));
//       setCountries(formattedCountries);
//       setFilteredCountries(formattedCountries);
//     } catch (error) {
//       setErrorLoadingCountries(true);
//       console.error('Error fetching countries from Firestore:', error);
//     } finally {
//       setLoadingCountries(false);
//     }
//   };

//   const fetchServices = async () => {
//     setLoadingServices(true);
//     try {
//       const servicesCollectionRef = collection(db, 'services');
//       const querySnapshot = await getDocs(servicesCollectionRef);
//       const formattedServices = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         category: doc.data().category,
//         quantity: doc.data().quantity,
//         price: doc.data().price,
//         main: doc.data().main || false,
//         isIncluded: doc.data().isIncluded || false,
//       }));
//       setServices(formattedServices);
//       setFilteredServices(formattedServices);
//     } catch (error) {
//       setErrorLoadingServices(true);
//       console.error('Failed to fetch services from Firestore', error);
//     } finally {
//       setLoadingServices(false);
//     }
//   };

//   const buyProduct = async () => {
//     if (!currentUser) {
//       toast({
//         variant: 'destructive',
//         title: 'Authentication required',
//         description: 'Please log in to purchase a product.',
//         action: (
//           <ToastAction onClick={() => navigate('/auth/signin')} altText="Go to login">
//             Go to Login
//           </ToastAction>
//         ),
//       });
//       return;
//     }

//     setBuying(true);
//     setFailedToBuy(false);
//     const country = selectedCountry?.name.toLowerCase();
//     const product = selectedService?.name.toLowerCase();

//     try {
//       const response = await axios.post('https://smsverify-server.vercel.app/api/buy-product', {
//         uid: currentUser.uid,
//         country,
//         product,
//       });

//       const id = response.data?.product?.id ?? null;

//       setSelectedCountry(null);
//       setSelectedService(null);
//       setSelectedOperator(null);

//       toast({
//         variant: 'success',
//         title: 'Product purchased successfully',
//         description: 'You can now use the service. Refresh page to see the changes.',
//       });
//       navigate(`/sms?id=${id}`);
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: 'destructive',
//             title: 'Insufficient balance',
//             description: 'Please top up your account to complete the purchase.',
//             action: (
//               <ToastAction onClick={() => navigate('/pay')} altText="Go to payment">
//                 Go to Payment
//               </ToastAction>
//             ),
//           });
//         } else {
//           toast({
//             variant: 'destructive',
//             title: 'Purchase failed',
//             description: 'Something went wrong while purchasing the product.',
//           });
//         }
//       } else {
//         toast({
//           variant: 'destructive',
//           title: 'Unknown error',
//           description: 'An unknown error occurred. Please try again.',
//           action: (
//             <ToastAction onClick={buyProduct} altText="Try again">
//               Try again
//             </ToastAction>
//           ),
//         });
//       }
//       setFailedToBuy(true);
//     } finally {
//       setBuying(false);
//     }
//   };

//   const toggleFavorite = (type: 'countries' | 'services', id: string) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [id]: !prev[type][id],
//       },
//     }));
//   };

//   return (
//     <div className="flex dark:bg-boxdark-2 min-w-full rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
//       <CountrySelector
//         selectedCountry={selectedCountry}
//         setSelectedCountry={setSelectedCountry}
//         countries={filteredCountries}
//         countrySearch={countrySearch}
//         setCountrySearch={setCountrySearch}
//         loadingCountries={loadingCountries}
//         errorLoadingCountries={errorLoadingCountries}
//         fetchCountries={fetchCountries}
//         favorites={favorites}
//         toggleFavorite={toggleFavorite}
//       />

//       <ServiceSelector
//         selectedService={selectedService}
//         setSelectedService={setSelectedService}
//         services={filteredServices}
//         serviceSearch={serviceSearch}
//         setServiceSearch={setServiceSearch}
//         loadingServices={loadingServices}
//         errorLoadingServices={errorLoadingServices}
//         fetchServices={fetchServices}
//         favorites={favorites}
//         toggleFavorite={toggleFavorite}
//         showMore={showMore}
//         setShowMore={setShowMore}
//         selectedCountry={selectedCountry}
//         getServicePrice={(serviceName, countryName) => getServicePrice(serviceName, countryName, allPricingData)}
//         allPricingData={allPricingData}
//       />

//       <div className="p-4">
//         {selectedService && (
//           <SelectedTile
//             item={{
//               ...selectedService,
//               price: selectedCountry && selectedService
//                 ? getServicePrice(selectedService.name, selectedCountry.name, allPricingData) ?? selectedService.price
//                 : selectedService.price,
//             }}
//             onCancel={() => setSelectedService(null)}
//             type="service"
//           />
//         )}
//         {buying && !failedToBuy && <Loader2 height="20px" />}
//         {!buying && (
//           <Button
//             onClick={buyProduct}
//             className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
//             disabled={!selectedCountry || !selectedService}
//           >
//             <ShoppingCart className="w-5 h-5" />
//             <span>
//               {failedToBuy && !buying
//                 ? 'Retry Purchase'
//                 : currentPrice !== null
//                 ? `Buy Number ($${currentPrice.toFixed(2)})`
//                 : 'Select Service and Country'}
//             </span>
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };







// import { useState, useEffect } from 'react';
// import { Button } from './ui/button';
// import { ScrollArea } from './ui/scrollarea';
// import { RefreshCcw, ShoppingCart } from 'lucide-react';
// import axios from 'axios';
// import { useAuth } from '../../contexts/authcontext';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useNavigate } from 'react-router-dom';
// import { ToastAction } from './ui/toast';
// import { toast } from './ui/use-toast';
// import Loader2 from '../../common/loader2';
// import { CountrySelector } from './buy-service/country-selector';
// import { ServiceSelector } from './buy-service/service-selector';
// import { SelectedTile } from './buy-service/SelectedTile';
// import { Country, Service, Operator } from './buy-service/types';
// import { fetchAllPricing, getServicePrice } from './buy-service/utils';

// interface ServiceSelectorProps {
//   selectedService: Service | null;
//   setSelectedService: React.Dispatch<React.SetStateAction<Service | null>>;
//   services: Service[];
//   serviceSearch: string;
//   setServiceSearch: React.Dispatch<React.SetStateAction<string>>;
//   loadingServices: boolean;
//   errorLoadingServices: boolean;
//   fetchServices: () => Promise<void>;
//   favorites: {
//     countries: Record<string, boolean>;
//     services: Record<string, boolean>;
//   };
//   toggleFavorite: (type: 'countries' | 'services', id: string) => void;
//   showMore: boolean;
//   setShowMore: React.Dispatch<React.SetStateAction<boolean>>;
//   selectedCountry: Country | null;
//   getServicePrice: (serviceName: string, countryName: string | null, allPricingData: { [key: string]: number | null }) => number | null;
//   allPricingData: { [key: string]: number | null };
// }

// export const ChooseService: React.FC = () => {
//   const { currentUser } = useAuth();
//   const navigate = useNavigate();
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [services, setServices] = useState<Service[]>([]);
//   const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
//   const [filteredServices, setFilteredServices] = useState<Service[]>([]);
//   const [operators, setOperators] = useState<Operator[]>([]);

//   const [countrySearch, setCountrySearch] = useState('');
//   const [serviceSearch, setServiceSearch] = useState('');
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
//   const [favorites, setFavorites] = useState<{
//     countries: Record<string, boolean>;
//     services: Record<string, boolean>;
//   }>(() => {
//     const storedFavorites = localStorage.getItem('favorites');
//     return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} };
//   });

//   const [showMore, setShowMore] = useState(false);
//   const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({});
//   const [loadingPricing, setLoadingPricing] = useState(true);
//   const [loadingCountries, setLoadingCountries] = useState(true);
//   const [loadingServices, setLoadingServices] = useState(true);
//   const [errorLoadingCountries, setErrorLoadingCountries] = useState(false);
//   const [errorLoadingServices, setErrorLoadingServices] = useState(false);
//   const [failedToBuy, setFailedToBuy] = useState(false);
//   const [buying, setBuying] = useState(false);
//   const [currentPrice, setCurrentPrice] = useState<number | null>(null);

//   useEffect(() => {
//     fetchCountries();
//     fetchServices();
//     fetchAllPricing().then(setAllPricingData).finally(() => setLoadingPricing(false));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('favorites', JSON.stringify(favorites));
//   }, [favorites]);

//   useEffect(() => {
//     if (selectedService && selectedCountry) {
//       const price = getServicePrice(selectedService.name, selectedCountry.name, allPricingData);
//       setCurrentPrice(price !== null ? price : selectedService.price);
//     } else {
//       setCurrentPrice(null);
//     }
//   }, [selectedService, selectedCountry, allPricingData]);

//   const fetchCountries = async () => {
//     setLoadingCountries(true);
//     try {
//       const countriesCollectionRef = collection(db, 'countries');
//       const q = query(countriesCollectionRef, where('included', '==', true));
//       const querySnapshot = await getDocs(q);
//       const formattedCountries = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         iso: doc.data().iso,
//         prefix: doc.data().prefix,
//       }));
//       setCountries(formattedCountries);
//       setFilteredCountries(formattedCountries);
//     } catch (error) {
//       setErrorLoadingCountries(true);
//       console.error('Error fetching countries from Firestore:', error);
//     } finally {
//       setLoadingCountries(false);
//     }
//   };

//   const fetchServices = async () => {
//     setLoadingServices(true);
//     try {
//       const servicesCollectionRef = collection(db, 'services');
//       const querySnapshot = await getDocs(servicesCollectionRef);
//       const formattedServices = querySnapshot.docs.map((doc) => ({
//         name: doc.data().name,
//         category: doc.data().category,
//         quantity: doc.data().quantity,
//         price: doc.data().price,
//         main: doc.data().main || false,
//         isIncluded: doc.data().isIncluded || false,
//       }));
//       setServices(formattedServices);
//       setFilteredServices(formattedServices);
//     } catch (error) {
//       setErrorLoadingServices(true);
//       console.error('Failed to fetch services from Firestore', error);
//     } finally {
//       setLoadingServices(false);
//     }
//   };

//   const buyProduct = async () => {
//     if (!currentUser) {
//       toast({
//         variant: 'destructive',
//         title: 'Authentication required',
//         description: 'Please log in to purchase a product.',
//         action: (
//           <ToastAction onClick={() => navigate('/auth/signin')} altText="Go to login">
//             Go to Login
//           </ToastAction>
//         ),
//       });
//       return;
//     }

//     setBuying(true);
//     setFailedToBuy(false);
//     const country = selectedCountry?.name.toLowerCase();
//     const product = selectedService?.name.toLowerCase();

//     try {
//       const response = await axios.post('https://smsverify-server.vercel.app/api/buy-product', {
//         uid: currentUser.uid,
//         country,
//         product,
//       });

//       const id = response.data?.product?.id ?? null;

//       setSelectedCountry(null);
//       setSelectedService(null);
//       setSelectedOperator(null);

//       toast({
//         variant: 'success',
//         title: 'Product purchased successfully',
//         description: 'You can now use the service. Refresh page to see the changes.',
//       });
//       navigate(`/sms?id=${id}`);
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: 'destructive',
//             title: 'Insufficient balance',
//             description: 'Please top up your account to complete the purchase.',
//             action: (
//               <ToastAction onClick={() => navigate('/pay')} altText="Go to payment">
//                 Go to Payment
//               </ToastAction>
//             ),
//           });
//         } else {
//           toast({
//             variant: 'destructive',
//             title: 'Purchase failed',
//             description: 'Something went wrong while purchasing the product.',
//           });
//         }
//       } else {
//         toast({
//           variant: 'destructive',
//           title: 'Unknown error',
//           description: 'An unknown error occurred. Please try again.',
//           action: (
//             <ToastAction onClick={buyProduct} altText="Try again">
//               Try again
//             </ToastAction>
//           ),
//         });
//       }
//       setFailedToBuy(true);
//     } finally {
//       setBuying(false);
//     }
//   };

//   const toggleFavorite = (type: 'countries' | 'services', id: string) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [id]: !prev[type][id],
//       },
//     }));
//   };

//   return (
//     <div className="flex dark:bg-boxdark-2 min-w-full rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
//       <CountrySelector
//         selectedCountry={selectedCountry}
//         setSelectedCountry={setSelectedCountry}
//         countries={filteredCountries}
//         countrySearch={countrySearch}
//         setCountrySearch={setCountrySearch}
//         loadingCountries={loadingCountries}
//         errorLoadingCountries={errorLoadingCountries}
//         fetchCountries={fetchCountries}
//         favorites={favorites}
//         toggleFavorite={toggleFavorite}
//       />

//       <ServiceSelector
//         selectedService={selectedService}
//         setSelectedService={setSelectedService}
//         services={filteredServices}
//         serviceSearch={serviceSearch}
//         setServiceSearch={setServiceSearch}
//         loadingServices={loadingServices}
//         errorLoadingServices={errorLoadingServices}
//         fetchServices={fetchServices}
//         favorites={favorites}
//         toggleFavorite={toggleFavorite}
//         showMore={showMore}
//         setShowMore={setShowMore}
//         selectedCountry={selectedCountry}
//         getServicePrice={(serviceName, countryName) => getServicePrice(serviceName, countryName, allPricingData)}
//         allPricingData={allPricingData}
//       />

//       <div className="p-4">
//         {selectedService && (
//           <SelectedTile
//             item={{
//               ...selectedService,
//               price: selectedCountry && selectedService
//                 ? getServicePrice(selectedService.name, selectedCountry.name, allPricingData) ?? selectedService.price
//                 : selectedService.price,
//             }}
//             onCancel={() => setSelectedService(null)}
//             type="service"
//           />
//         )}
//         {buying && !failedToBuy && <Loader2 height="20px" />}
//         {!buying && (
//           <Button
//             onClick={buyProduct}
//             className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
//             disabled={!selectedCountry || !selectedService}
//           >
//             <ShoppingCart className="w-5 h-5" />
//             <span>
//               {failedToBuy && !buying
//                 ? 'Retry Purchase'
//                 : currentPrice !== null
//                 ? `Buy Number ($${currentPrice.toFixed(2)})`
//                 : 'Select Service and Country'}
//             </span>
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };