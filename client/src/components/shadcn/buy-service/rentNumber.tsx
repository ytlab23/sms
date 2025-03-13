// import type React from "react"
// import { useState, useEffect, useMemo } from "react"
// import { motion } from "framer-motion"
// import { useTranslation } from "react-i18next"
// import { db } from "../../../firebase/config"
// import { collection, getDocs, query, where } from "firebase/firestore"
// import { Button } from "./../ui/button"
// import { Input } from "./../ui/input"
// import { Label } from "./../ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card"
// import { useToast } from "./../ui/use-toast"
// import { Loader2, ShoppingCart, Shield, Globe, Zap, DollarSign, Info } from "lucide-react"
// import { CountrySelector } from "../buy-service/country-selector"
// import { useAuth } from "../../../contexts/authcontext"
// import { useNavigate } from "react-router-dom"
// import axios from "axios"

// import type { Country } from "../buy-service/types"

// interface RentPricing {
//   [countryName: string]: number
// }

// export default function RentNumber() {
//   const { t, i18n } = useTranslation()
//   const { currentUser } = useAuth()
//   const navigate = useNavigate()
//   const { toast } = useToast()

//   const [countries, setCountries] = useState<Country[]>([])
//   const [rentPricing, setRentPricing] = useState<RentPricing>({})
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
//   const [days, setDays] = useState(1)
//   const [loading, setLoading] = useState(true)
//   const [countrySearch, setCountrySearch] = useState("")
//   const [renting, setRenting] = useState(false)
//   const [favorites, setFavorites] = useState<{ countries: Record<string, boolean>; services: Record<string, boolean> }>(
//     () => {
//       const storedFavorites = localStorage.getItem("favorites")
//       return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} }
//     },
//   )

//   useEffect(() => {
//     fetchData()
//   }, [])

//   useEffect(() => {
//     localStorage.setItem("favorites", JSON.stringify(favorites))
//   }, [favorites])

//   const fetchData = async () => {
//     try {
//       const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
//       const countriesSnapshot = await getDocs(countriesQuery)
//       const countriesData = countriesSnapshot.docs.map((doc) => ({
//         code: doc.id,
//         name: doc.data().name,
//         iso: doc.data().iso,
//         prefix: doc.data().prefix,
//       }))
//       setCountries(countriesData)

//       const rentPricingSnapshot = await getDocs(collection(db, "rent_pricing"))
//       const rentPricingData: RentPricing = {}
//       rentPricingSnapshot.docs.forEach((doc) => {
//         rentPricingData[doc.id] = doc.data().pricePerDay
//       })
//       setRentPricing(rentPricingData)
//       console.log(rentPricingData)

//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch data. Please try again.",
//         variant: "destructive",
//       })
//       setLoading(false)
//     }
//   }

//   const calculateTotalPrice = () => {
//     if (!selectedCountry || days <= 0) return 0
//     const pricePerDay = rentPricing[selectedCountry.name] || 0
//     console.log("Selected country:", selectedCountry.name, "Price per day:", pricePerDay)
//     return pricePerDay * days
//   }

//   const handleRent = async () => {
//     if (!currentUser) {
//       toast({
//         variant: "destructive",
//         title: t("actionsidebar.Authentication Required"),
//         description: t("actionsidebar.Please Login"),
//         action: (
//           <Button onClick={() => navigate(`/${i18n.language}/${t("urls.auth/signin")}`)}>
//             {t("actionsidebar.Go to login")}
//           </Button>
//         ),
//       })
//       return
//     }

//     if (!selectedCountry || !days) {
//       toast({
//         variant: "destructive",
//         title: t("error.Selection Required"),
//         description: t("error.Select Country and Days"),
//       })
//       return
//     }

//     setRenting(true)
//     try {
//       const response = await axios.post("https://smsapp-backend.vercel.app/api/rent-number", {
//         uid: currentUser.uid,
//         country: selectedCountry.iso.toLowerCase(),
//         days: days,
//       })

//       const id = response.data?.rental?.id ?? null

//       toast({
//         variant: "success",
//         title: t("rentNumber.Success"),
//         description: t("rentNumber.NumberRented"),
//       })
//       setSelectedCountry(null)
//       setDays(1)
//       navigate(`/${i18n.language}/${t("urls.rentals")}?id=${id}`)
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: "destructive",
//             title: t("actionsidebar.Insufficient Balance"),
//             description: t("actionsidebar.Top Up Required"),
//             action: (
//               <Button onClick={() => navigate(`/${i18n.language}/${t("urls.pay")}`)}>
//                 {t("actionsidebar.Go To Payment")}
//               </Button>
//             ),
//           })
//         } else {
//           toast({
//             variant: "destructive",
//             title: t("rentNumber.RentalFailed"),
//             description: t("actionsidebar.Unknown Error"),
//           })
//         }
//       } else {
//         toast({
//           variant: "destructive",
//           title: t("actionsidebar.Unknown Error"),
//           description: t("actionsidebar.Try Again Later"),
//         })
//       }
//     } finally {
//       setRenting(false)
//     }
//   }

//   const toggleFavorite = (type: "countries" | "services", id: string) => {
//     setFavorites((prev) => ({
//       ...prev,
//       [type]: {
//         ...prev[type],
//         [id]: !prev[type][id],
//       },
//     }))
//   }

//   const filteredCountries = useMemo(() => {
//     return countries.filter(
//       (country) =>
//         country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
//         t(`country.${country.iso}`).toLowerCase().includes(countrySearch.toLowerCase()),
//     )
//   }, [countries, countrySearch, t])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-whiten dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//       <div className="container mx-auto px-4 py-8">
//         <motion.h1
//           className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
//           initial={{ opacity: 0, y: -30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7 }}
//         >
//           {t("rentNumber.title")}
//         </motion.h1>
//         <motion.p
//           className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.2 }}
//         >
//           {t("rentNumber.subtitle")}
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.4 }}
//         >
//           <Card className="bg-white dark:bg-gray-800 shadow-xl">
//             <CardHeader>
//               <CardTitle className="text-2xl text-center text-blue-600 dark:text-blue-400">
//                 {t("rentNumber.selectCountryAndDuration")}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <CountrySelector
//                     order="1"
//                     selectedCountry={selectedCountry}
//                     setSelectedCountry={setSelectedCountry}
//                     countries={filteredCountries}
//                     countrySearch={countrySearch}
//                     setCountrySearch={setCountrySearch}
//                     loadingCountries={loading}
//                     errorLoadingCountries={false}
//                     fetchCountries={fetchData}
//                     favorites={favorites}
//                     toggleFavorite={toggleFavorite}
//                     getSuccessRate={() => null}
//                   />
//                 </div>
//                 <div className="flex flex-col justify-center h-full space-y-4">
//                   <div>
//                     <Label htmlFor="days" className="text-lg font-semibold mb-2 block">
//                       {t("rentNumber.rentDuration")}
//                     </Label>
//                     <Input
//                       id="days"
//                       type="number"
//                       min="1"
//                       value={days}
//                       onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//                         const value = e.target.value
//                         setDays(value === "" ? 1 : Math.max(1, Number.parseInt(value, 10)))
//                       }}
//                       className="text-lg p-4"
//                       placeholder={t("rentNumber.enterDays")}
//                     />
//                   </div>
//                   <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
//                     <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center">
//                       {/* <DollarSign className="mr-2" /> */}
//                       {t("rentNumber.totalPrice")}: ${calculateTotalPrice().toFixed(2)}
//                     </p>
//                   </div>
//                   <Button
//                     onClick={handleRent}
//                     className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
//                     disabled={!selectedCountry || !days || renting}
//                   >
//                     {renting ? (
//                       <Loader2 className="mr-2 h-5 w-5 animate-spin" />
//                     ) : (
//                       <ShoppingCart className="mr-2 h-5 w-5" />
//                     )}
//                     {t("rentNumber.rentNow")}
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* <motion.div
//           className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.7, delay: 0.6 }}
//         >
//           <h3 className="text-xl font-semibold mb-4 flex items-center">
//             <Info className="mr-2" />
//             {t("rentNumber.aboutRenting")}
//           </h3>
//           <p className="text-gray-600 dark:text-gray-300">{t("rentNumber.rentingInfo")}</p>
//         </motion.div> */}
//       </div>

//       <section className="mt-20">
//         <motion.h2
//           className="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-white"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           {t("rentNumber.howItWorks")}
//         </motion.h2>
//         <div className="grid md:grid-cols-3 gap-12">
//           {[
//             {
//               icon: <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />,
//               title: t("rentNumber.secure"),
//               description: t("rentNumber.secureDescription"),
//             },
//             {
//               icon: <Globe className="h-16 w-16 text-green-600 dark:text-green-400" />,
//               title: t("rentNumber.global"),
//               description: t("rentNumber.globalDescription"),
//             },
//             {
//               icon: <Zap className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />,
//               title: t("rentNumber.instant"),
//               description: t("rentNumber.instantDescription"),
//             },
//           ].map((item, index) => (
//             <motion.div
//               key={index}
//               className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: 0.2 * index }}
//             >
//               <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">{item.icon}</div>
//               <h3 className="text-2xl font-semibold mb-4 dark:text-white">{item.title}</h3>
//               <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//     </div>
//   )
// }

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Button } from './../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './../ui/select';
import { useToast } from './../ui/use-toast';
import { Loader2, ShoppingCart, Shield, Globe, Zap } from 'lucide-react';
import { CountrySelector } from '../buy-service/country-selector';
import { useAuth } from '../../../contexts/authcontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import type { Country } from '../buy-service/types';

interface RentPricing {
  [countryName: string]: {
    [duration: string]: number;
  };
}

const durations = [
  { value: '7', label: '7 Days' },
  { value: '30', label: '30 Days' },
  { value: '90', label: '90 Days' },
  { value: '365', label: '365 Days' },
];

export default function RentNumber() {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [countries, setCountries] = useState<Country[]>([]);
  const [rentPricing, setRentPricing] = useState<RentPricing>({});
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedDuration, setSelectedDuration] = useState('7');
  const [loading, setLoading] = useState(true);
  const [countrySearch, setCountrySearch] = useState('');
  const [renting, setRenting] = useState(false);
  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
  }>(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites
      ? JSON.parse(storedFavorites)
      : { countries: {}, services: {} };
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchData = async () => {
    try {
      const countriesQuery = query(
        collection(db, 'countries'),
        where('included', '==', true),
      );
      const countriesSnapshot = await getDocs(countriesQuery);
      const countriesData = countriesSnapshot.docs.map((doc) => ({
        code: doc.id,
        name: doc.data().name,
        iso: doc.data().iso,
        prefix: doc.data().prefix,
      }));
      setCountries(countriesData);

      const rentPricingSnapshot = await getDocs(collection(db, 'rent_pricing'));
      const rentPricingData: RentPricing = {};
      rentPricingSnapshot.docs.forEach((doc) => {
        rentPricingData[doc.id] = doc.data().prices;
      });
      setRentPricing(rentPricingData);
      console.log(rentPricingData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedCountry || !selectedDuration) return 0;
    const price = rentPricing[selectedCountry.name]?.[selectedDuration] || 0;
    console.log(
      'Selected country:',
      selectedCountry.name,
      'Price for',
      selectedDuration,
      'days:',
      price,
    );
    return price;
  };

  const handleRent = async () => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: t('actionsidebar.Authentication Required'),
        description: t('actionsidebar.Please Login'),
        action: (
          <Button
            onClick={() =>
              navigate(`/${i18n.language}/${t('urls.auth/signin')}`)
            }
          >
            {t('actionsidebar.Go to login')}
          </Button>
        ),
      });
      return;
    }

    if (!selectedCountry || !selectedDuration) {
      toast({
        variant: 'destructive',
        title: t('error.Selection Required'),
        description: t('error.Select Country and Duration'),
      });
      return;
    }

    setRenting(true);
    try {
      const response = await axios.post(
        'https://smsapp-backend.vercel.app/api/rent-number',
        {
          uid: currentUser.uid,
          country: selectedCountry.iso.toLowerCase(),
          days: Number.parseInt(selectedDuration),
        },
      );

      const id = response.data?.rental?.id ?? null;

      toast({
        variant: 'success',
        title: t('rentNumber.Success'),
        description: t('rentNumber.NumberRented'),
      });
      setSelectedCountry(null);
      setSelectedDuration('7');
      navigate(`/${i18n.language}/${t('urls.rentals')}?id=${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: t('actionsidebar.Insufficient Balance'),
            description: t('actionsidebar.Top Up Required'),
            action: (
              <Button
                onClick={() => navigate(`/${i18n.language}/${t('urls.pay')}`)}
              >
                {t('actionsidebar.Go To Payment')}
              </Button>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: t('rentNumber.RentalFailed'),
            description: t('actionsidebar.Unknown Error'),
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: t('actionsidebar.Unknown Error'),
          description: t('actionsidebar.Try Again Later'),
        });
      }
    } finally {
      setRenting(false);
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

  const filteredCountries = useMemo(() => {
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        t(`country.${country.iso}`)
          .toLowerCase()
          .includes(countrySearch.toLowerCase()),
    );
  }, [countries, countrySearch, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-whiten dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t('rentNumber.title')}
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-10 text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {t('rentNumber.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-600 dark:text-blue-400">
                {t('rentNumber.selectCountryAndDuration')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <CountrySelector
                    order="1"
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    countries={filteredCountries}
                    countrySearch={countrySearch}
                    setCountrySearch={setCountrySearch}
                    loadingCountries={loading}
                    errorLoadingCountries={false}
                    fetchCountries={fetchData}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    getSuccessRate={() => null}
                  />
                </div>
                <div className="flex flex-col justify-center h-full space-y-4">
                  <div>
                    <Select
                      value={selectedDuration}
                      onValueChange={setSelectedDuration}
                    >
                      <SelectTrigger className="w-full text-lg p-4">
                        <SelectValue
                          placeholder={t('rentNumber.selectDuration')}
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800">
                        {durations.map((duration) => (
                          <SelectItem
                            key={duration.value}
                            value={duration.value}
                            className="hover:bg-blue-100 dark:hover:bg-blue-900"
                          >
                            {duration.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      {t('rentNumber.totalPrice')}: $
                      {calculateTotalPrice().toFixed(2)}
                    </p>
                  </div>
                  <Button
                    onClick={handleRent}
                    className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    disabled={!selectedCountry || !selectedDuration || renting}
                  >
                    {renting ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-5 w-5" />
                    )}
                    {t('rentNumber.rentNow')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <section className="mt-20">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center text-gray-800 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('rentNumber.howItWorks')}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                ),
                title: t('rentNumber.secure'),
                description: t('rentNumber.secureDescription'),
              },
              {
                icon: (
                  <Globe className="h-16 w-16 text-green-600 dark:text-green-400" />
                ),
                title: t('rentNumber.global'),
                description: t('rentNumber.globalDescription'),
              },
              {
                icon: (
                  <Zap className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
                ),
                title: t('rentNumber.instant'),
                description: t('rentNumber.instantDescription'),
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 * index }}
              >
                <div className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
