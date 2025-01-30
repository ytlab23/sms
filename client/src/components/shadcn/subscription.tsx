

// // // import React, { useState, useEffect } from "react"
// // // import { useTranslation } from "react-i18next"
// // // import { Check, Clock, Calendar, CalendarDays, CalendarCheck } from "lucide-react"
// // // import { Button } from "./ui/button"
// // // import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"
// // // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// // // import { db } from "../../firebase/config"
// // // import { collection, getDocs, query, where } from "firebase/firestore"

// // // interface Country {
// // //   code: string
// // //   name: string
// // //   iso: string
// // // }

// // // interface PlanPrice {
// // //   [countryCode: string]: number
// // // }

// // // interface PlanFeature {
// // //   text: string
// // //   included: boolean
// // // }

// // // interface Plan {
// // //   id: string
// // //   name: {
// // //     [lang: string]: string
// // //   }
// // //   description: {
// // //     [lang: string]: string
// // //   }
// // //   duration: number
// // //   prices: PlanPrice
// // //   features: {
// // //     [lang: string]: PlanFeature[]
// // //   }
// // //   discount: number
// // //   popular: boolean
// // // }

// // // const icons = {
// // //   7: Clock,
// // //   30: Calendar,
// // //   90: CalendarDays,
// // //   365: CalendarCheck,
// // // }

// // // export default function SubscriptionPlansDisplay() {
// // //   const [plans, setPlans] = useState<Plan[]>([])
// // //   const [countries, setCountries] = useState<Country[]>([])
// // //   const [selectedCountry, setSelectedCountry] = useState<string>("")
// // //   const [loading, setLoading] = useState(true)
// // //   const { t, i18n } = useTranslation()

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         // Fetch countries
// // //         const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
// // //         const countriesSnapshot = await getDocs(countriesQuery)
// // //         const countriesData = countriesSnapshot.docs.map((doc) => ({
// // //           code: doc.id,
// // //           name: doc.data().name,
// // //           iso: doc.data().iso,
// // //         }))
// // //         setCountries(countriesData)
// // //         setSelectedCountry(countriesData[0]?.code || "")

// // //         // Fetch plans
// // //         const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
// // //         const plansData = plansSnapshot.docs.map((doc) => ({
// // //           id: doc.id,
// // //           ...doc.data(),
// // //         })) as Plan[]

// // //         const sortOrder = [7, 30, 90, 365]
// // //         plansData.sort((a, b) => sortOrder.indexOf(a.duration) - sortOrder.indexOf(b.duration))

// // //         setPlans(plansData)

// // //         setLoading(false)
// // //       } catch (error) {
// // //         console.error("Error fetching data:", error)
// // //         setLoading(false)
// // //       }
// // //     }

// // //     fetchData()
// // //   }, [])

// // //   const getPrice = (plan: Plan) => {
// // //     const originalPrice = plan.prices[selectedCountry] || Object.values(plan.prices)[0] || 0
// // //     const discountedPrice = originalPrice * (1 - plan.discount / 100)
// // //     return {
// // //       original: originalPrice.toFixed(2),
// // //       discounted: discountedPrice.toFixed(2),
// // //     }
// // //   }

// // //   const getPlanName = (plan: Plan) => {
// // //     switch (plan.duration) {
// // //       case 7:
// // //         return t("subscriptionPlans.weekly")
// // //       case 30:
// // //         return t("subscriptionPlans.monthly")
// // //       case 90:
// // //         return t("subscriptionPlans.quarterly")
// // //       case 365:
// // //         return t("subscriptionPlans.yearly")
// // //       default:
// // //         return t("subscriptionPlans.custom", { days: plan.duration })
// // //     }
// // //   }

// // //   if (loading) {
// // //     return (
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //         <div className="animate-pulse space-y-4">
// // //           <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
// // //           <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
// // //             {[1, 2, 3, 4].map((i) => (
// // //               <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="bg-gradient-to-b min-h-screen">
// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //         <div className="text-center">
// // //           <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t("subscriptionPlans.title")}</h2>
// // //           <p className="mt-4 text-xl text-gray-600">{t("subscriptionPlans.subtitle")}</p>
// // //         </div>
// // //         <div className="mt-8 flex justify-center items-center space-x-4">
// // //           <label htmlFor="country-select" className="text-xl  font-bold text-blue-600">
// // //             {t("subscriptionPlans.chooseCountry")}
// // //           </label>
// // //           <Select
// // //             value={selectedCountry}
// // //             onValueChange={setSelectedCountry}
// // //             aria-label={t("subscriptionPlans.chooseCountry")}
// // //           >
// // //             <SelectTrigger id="country-select" className="w-[200px]">
// // //               <SelectValue placeholder={t("subscriptionPlans.selectCountry")} />
// // //             </SelectTrigger>
// // //             <SelectContent className="bg-white">
// // //               {countries.map((country) => (
// // //                 <SelectItem
// // //                   key={country.code}
// // //                   value={country.code}
// // //                   className="hover:bg-blue-100 transition-colors duration-150"
// // //                 >
// // //                   <div className="flex items-center">
// // //                     <img
// // //                       src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
// // //                       alt={`Flag of ${country.name}`}
// // //                       className="mr-2"
// // //                       width={20}
// // //                       height={20}
// // //                     />
// // //                     {country.name}
// // //                   </div>
// // //                 </SelectItem>
// // //               ))}
// // //             </SelectContent>
// // //           </Select>
// // //         </div>
// // //         <div className="mt-12 px-16   space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
// // //           {plans.map((plan) => {
// // //             const Icon = icons[plan.duration as keyof typeof icons] || Clock
// // //             return (
// // //               <Card
// // //                 key={plan.id}
// // //                 className={`flex bg-blue-100 hover:bg-blue-50 flex-col justify-between rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-500 hover:border-2 ${
// // //                   plan.popular ? "border-blue-500 border-2 hover:bg-blue-50 scale-105" : ""
// // //                 }`}
// // //               >
// // //                 <CardHeader className="flex flex-col items-center">
// // //                   <div className="p-3 bg-blue-100 rounded-full mb-4">
// // //                     <Icon className="w-8 h-8 text-blue-600" />
// // //                   </div>
// // //                   <CardTitle className="text-2xl font-semibold">{plan.name[i18n.language] || plan.name.en}</CardTitle>
// // //                   <CardDescription>{plan.description[i18n.language] || plan.description.en}</CardDescription>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <div className="text-center">
// // //                     <div className="mb-2">
// // //                       <span className="text-3xl font-extrabold">${getPrice(plan).discounted}</span>
// // //                       <span className="text-base font-medium text-gray-500">/{getPlanName(plan)}</span>
// // //                     </div>
// // //                     {plan.discount > 0 && (
// // //                       <div className="text-sm">
// // //                         <span className="line-through text-gray-500">${getPrice(plan).original}</span>
// // //                         <span className="ml-2 font-medium text-red-500">Save {plan.discount}%</span>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                   <ul className="mt-6 space-y-2">
// // //                     {(plan.features[i18n.language] || plan.features.en).map((feature, index) => (
// // //                       <li key={index} className="flex items-start">
// // //                         <div className="flex-shrink-0">
// // //                           <Check className={`h-5 w-5 ${feature.included ? "text-blue-500" : "text-gray-300"}`} />
// // //                         </div>
// // //                         <p className="ml-3 text-base text-gray-700">{feature.text}</p>
// // //                       </li>
// // //                     ))}
// // //                   </ul>
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300">
// // //                     {plan.popular ? t("subscriptionPlans.getStarted") : t("subscriptionPlans.choosePlan")}
// // //                   </Button>
// // //                 </CardFooter>
// // //                 {plan.popular && (
// // //                   <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full transform rotate-12 shadow-lg ">
// // //                     {t("subscriptionPlans.popular")}
// // //                   </div>
// // //                 )}
// // //               </Card>
// // //             )
// // //           })}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }



// import { useState, useEffect } from "react"
// import { useTranslation } from "react-i18next"
// import {
//   Check,
//   Clock,
//   Calendar,
//   CalendarDays,
//   CalendarCheck,
//   Search,
//   Star,
//   RefreshCcw,
//   HelpCircle,
//   X,
//   CreditCard,
//   PhoneCall,
// } from "lucide-react"
// import { Button } from "./ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { Input } from "./ui/input"
// import { ScrollArea } from "./ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
// import { db } from "../../firebase/config"
// import { collection, getDocs, query, where } from "firebase/firestore"

// // Types
// interface Country {
//   code: string
//   name: string
//   iso: string
// }

// interface Service {
//   name: string
//   main: boolean
//   isIncluded: boolean
//   price: number
// }

// interface PlanPrice {
//   [countryCode: string]: number
// }

// interface PlanFeature {
//   text: string
//   included: boolean
// }

// interface Plan {
//   id: string
//   name: {
//     [lang: string]: string
//   }
//   description: {
//     [lang: string]: string
//   }
//   duration: number
//   prices: PlanPrice
//   features: {
//     [lang: string]: PlanFeature[]
//   }
//   discount: number
//   popular: boolean
// }

// // Icons for plan durations
// const icons = {
//   7: Clock,
//   30: Calendar,
//   90: CalendarDays,
//   365: CalendarCheck,
// }

// // SelectedTile Component
// function SelectedTile({
//   item,
//   onCancel,
//   type,
//   iso,
// }: { item: any; onCancel: () => void; type: "country" | "service"; iso?: string }) {
//   const [imageError, setImageError] = useState(false)
//   const { t } = useTranslation()

//   const getImageSrc = () => {
//     if (type === "country") {
//       return `https://flagcdn.com/w20/${iso?.toLowerCase()}.png`
//     } else {
//       return `https://logo.clearbit.com/${item.name.toLowerCase()}.com`
//     }
//   }

//   return (
//     <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-boxdark-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
//       <div className="flex items-center space-x-3">
//         {!imageError ? (
//           <img
//             src={getImageSrc() || "/placeholder.svg"}
//             alt={type === "country" ? `Flag of ${item.name}` : `Icon of ${item.name}`}
//             className="w-6 h-6 object-contain"
//             onError={() => setImageError(true)}
//           />
//         ) : (
//           <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
//             <HelpCircle className="w-5 h-5 text-blue-600" />
//           </div>
//         )}
//         <div className="flex flex-col">
//           {type === "service" && (
//             <span className="font-medium">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
//           )}
//           {type === "country" && <span className="font-medium">{t(`country.${iso}`)}</span>}
//           <div className="flex space-x-2 text-sm">
//             {type === "service" && item.price && (
//               <span className="text-blue-500 dark:text-blue-400">
//                 {t("actionsidebar.Price")}: ${item.price.toFixed(2)}
//               </span>
//             )}
//             {item.successRate !== null && item.successRate !== undefined && (
//               <span className="text-green-500 dark:text-green-400">
//                 {t("actionsidebar.Success")}: {item.successRate.toFixed(2)}%
//               </span>
//             )}
//           </div>
//         </div>
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
//   )
// }

// // CountrySelector Component
// function CountrySelector({
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
//   getSuccessRate,
// }: {
//   selectedCountry: Country | null
//   setSelectedCountry: (country: Country | null) => void
//   countries: Country[]
//   countrySearch: string
//   setCountrySearch: (search: string) => void
//   loadingCountries: boolean
//   errorLoadingCountries: boolean
//   fetchCountries: () => void
//   favorites: { countries: Record<string, boolean> }
//   toggleFavorite: (type: "countries" | "services", id: string) => void
//   getSuccessRate: (countryName: string) => number | null
// }) {
//   const { t } = useTranslation()

//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle>{t("actionsidebar.1.Select country")}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {selectedCountry ? (
//           <SelectedTile
//             item={{
//               ...selectedCountry,
//               successRate: getSuccessRate(selectedCountry.name),
//             }}
//             onCancel={() => setSelectedCountry(null)}
//             type="country"
//             iso={selectedCountry.iso}
//           />
//         ) : (
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder={t("actionsidebar.Find country")}
//               className="pl-10 dark:bg-boxdark"
//               value={countrySearch}
//               onChange={(e) => setCountrySearch(e.target.value)}
//             />
//           </div>
//         )}

//         {loadingCountries && <div>Loading...</div>}

//         {errorLoadingCountries && !loadingCountries && (
//           <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
//             <span>{t("actionsidebar.Error loading countries")}</span>
//             <Button onClick={fetchCountries} variant="outline" size="sm">
//               <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
//             </Button>
//           </div>
//         )}

//         {!selectedCountry && !loadingCountries && (
//           <ScrollArea className="h-[300px] overflow-y-auto mt-4">
//             <div className="space-y-2">
//               {countries.map((country, index) => {
//                 const successRate = getSuccessRate(country.name)
//                 return (
//                   <Button
//                     key={`${country.iso}-${index}`}
//                     variant="ghost"
//                     className="w-full dark:bg-boxdark bg-white justify-start font-normal h-14 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                     onClick={() => setSelectedCountry(country)}
//                   >
//                     <div className="flex items-center w-full">
//                       <Star
//                         className={`h-5 w-5 mr-2 ${
//                           favorites.countries[country.name] ? "text-yellow-400" : "text-gray-400"
//                         } cursor-pointer`}
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           toggleFavorite("countries", country.name)
//                         }}
//                       />
//                       <img
//                         src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
//                         alt={`Flag of ${country.name}`}
//                         className="mr-2"
//                         width={20}
//                         height={20}
//                       />
//                       <span className="flex-grow">{t(`country.${country.iso}`)}</span>
//                       {successRate !== null && (
//                         <span className="text-sm text-green-500 dark:text-green-400">
//                           {t("actionsidebar.Success")}:{successRate.toFixed(2)}%
//                         </span>
//                       )}
//                     </div>
//                   </Button>
//                 )
//               })}
//             </div>
//           </ScrollArea>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// // ServiceSelector Component
// function ServiceSelector({
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
//   getSuccessRate,
// }: {
//   selectedService: Service | null
//   setSelectedService: (service: Service | null) => void
//   services: Service[]
//   serviceSearch: string
//   setServiceSearch: (search: string) => void
//   loadingServices: boolean
//   errorLoadingServices: boolean
//   fetchServices: () => void
//   favorites: { services: Record<string, boolean> }
//   toggleFavorite: (type: "countries" | "services", id: string) => void
//   showMore: boolean
//   setShowMore: (show: boolean) => void
//   selectedCountry: Country | null
//   getServicePrice: (serviceName: string, countryName: string | null) => number | null
//   getSuccessRate: (serviceName: string) => number | null
// }) {
//   const mainServices = services.filter((service) => service.main && service.isIncluded)
//   const includedServices = services.filter((service) => service.isIncluded)
//   const [imageError, setImageError] = useState<Record<string, boolean>>({})
//   const { t } = useTranslation()

//   return (
//     <Card className="h-full">
//       <CardHeader>
//         <CardTitle>{t("actionsidebar.2.Select service")}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {selectedService ? (
//           <SelectedTile
//             item={{
//               ...selectedService,
//               price: getServicePrice(selectedService.name, selectedCountry?.name ?? null) ?? undefined,
//               successRate: getSuccessRate(selectedService.name),
//             }}
//             onCancel={() => setSelectedService(null)}
//             type="service"
//           />
//         ) : (
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder={t("actionsidebar.Find website or app")}
//               className="pl-10 dark:bg-boxdark"
//               value={serviceSearch}
//               onChange={(e) => setServiceSearch(e.target.value)}
//             />
//           </div>
//         )}

//         {loadingServices && <div>Loading...</div>}

//         {errorLoadingServices && !loadingServices && (
//           <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
//             <span>{t("actionsidebar.Error loading services")}</span>
//             <Button onClick={fetchServices} variant="outline" size="sm">
//               <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
//             </Button>
//           </div>
//         )}

//         {!selectedService && !loadingServices && (
//           <ScrollArea className="h-[300px] overflow-y-auto mt-4">
//             <div className="space-y-2">
//               {(showMore ? includedServices : mainServices).map((service: Service, index: number) => {
//                 const countrySpecificPrice = selectedCountry
//                   ? getServicePrice(service.name, selectedCountry.name)
//                   : null
//                 const successRate = getSuccessRate(service.name)
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
//                           favorites.services[service.name] ? "text-yellow-400" : "text-gray-400"
//                         } cursor-pointer`}
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           toggleFavorite("services", service.name)
//                         }}
//                       />
//                       <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
//                         {!imageError[service.name] ? (
//                           <img
//                             src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
//                             alt={`Icon of ${service.name}`}
//                             className="w-5 h-5 object-contain"
//                             onError={() => {
//                               setImageError((prev) => ({
//                                 ...prev,
//                                 [service.name]: true,
//                               }))
//                             }}
//                           />
//                         ) : (
//                           <HelpCircle className="w-5 h-5 text-blue-600" />
//                         )}
//                       </div>
//                       <span className="flex-grow">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</span>
//                       <div className="flex flex-col items-end">
//                         <span className="text-sm text-blue-500 dark:text-blue-400">
//                           {t("actionsidebar.Price")}: $
//                           {(countrySpecificPrice !== null ? countrySpecificPrice : service.price).toFixed(2)}
//                         </span>
//                         {successRate !== null && (
//                           <span className="text-sm text-green-500 dark:text-green-400">
//                             {t("actionsidebar.Success")}:{successRate.toFixed(2)}%
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </Button>
//                 )
//               })}
//             </div>
//           </ScrollArea>
//         )}

//         {!selectedService && !loadingServices && (
//           <Button onClick={() => setShowMore(!showMore)} variant="link" className="w-full text-blue-500 mt-2">
//             {showMore
//               ? t("actionsidebar.See Less", { count: mainServices.length })
//               : t("actionsidebar.See More", { count: includedServices.length })}
//           </Button>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

// // TemporaryNumbersTab Component
// function TemporaryNumbersTab({
//   countries,
//   services,
//   getServicePrice,
//   getSuccessRate,
// }: {
//   countries: Country[]
//   services: Service[]
//   getServicePrice: (serviceName: string, countryName: string | null) => number | null
//   getSuccessRate: (serviceName: string) => number | null
// }) {
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
//   const [selectedService, setSelectedService] = useState<Service | null>(null)
//   const [countrySearch, setCountrySearch] = useState("")
//   const [serviceSearch, setServiceSearch] = useState("")
//   const [showMore, setShowMore] = useState(false)
//   const { t } = useTranslation()

//   const price = selectedCountry && selectedService ? getServicePrice(selectedService.name, selectedCountry.name) : null
//   const successRate = selectedService ? getSuccessRate(selectedService.name) : null

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       <CountrySelector
//         selectedCountry={selectedCountry}
//         setSelectedCountry={setSelectedCountry}
//         countries={countries}
//         countrySearch={countrySearch}
//         setCountrySearch={setCountrySearch}
//         loadingCountries={false}
//         errorLoadingCountries={false}
//         fetchCountries={() => {}}
//         favorites={{ countries: {} }}
//         toggleFavorite={() => {}}
//         getSuccessRate={getSuccessRate}
//       />
//       <ServiceSelector
//         selectedService={selectedService}
//         setSelectedService={setSelectedService}
//         services={services}
//         serviceSearch={serviceSearch}
//         setServiceSearch={setServiceSearch}
//         loadingServices={false}
//         errorLoadingServices={false}
//         fetchServices={() => {}}
//         favorites={{ services: {} }}
//         toggleFavorite={() => {}}
//         showMore={showMore}
//         setShowMore={setShowMore}
//         selectedCountry={selectedCountry}
//         getServicePrice={getServicePrice}
//         getSuccessRate={getSuccessRate}
//       />
//       <Card className="md:col-span-2">
//         <CardHeader>
//           <CardTitle>{t("temporaryNumbers.pricingAndSuccess")}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {selectedCountry && selectedService ? (
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-lg font-semibold">{t("temporaryNumbers.price")}</p>
//                 <p className="text-3xl font-bold text-blue-600">
//                   ${price?.toFixed(2) || t("temporaryNumbers.notAvailable")}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-lg font-semibold">{t("temporaryNumbers.successRate")}</p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {successRate ? `${successRate.toFixed(2)}%` : t("temporaryNumbers.notAvailable")}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">{t("temporaryNumbers.selectCountryAndService")}</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// // SubscriptionPlansDisplay Component
// function SubscriptionPlansDisplay({ plans, countries }: { plans: Plan[]; countries: Country[] }) {
//   const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]?.code || "")
//   const { t, i18n } = useTranslation()

//   const getPrice = (plan: Plan) => {
//     const originalPrice = plan.prices[selectedCountry] || Object.values(plan.prices)[0] || 0
//     const discountedPrice = originalPrice * (1 - plan.discount / 100)
//     return {
//       original: originalPrice.toFixed(2),
//       discounted: discountedPrice.toFixed(2),
//     }
//   }

//   const getPlanName = (plan: Plan) => {
//     switch (plan.duration) {
//       case 7:
//         return t("subscriptionPlans.weekly")
//       case 30:
//         return t("subscriptionPlans.monthly")
//       case 90:
//         return t("subscriptionPlans.quarterly")
//       case 365:
//         return t("subscriptionPlans.yearly")
//       default:
//         return t("subscriptionPlans.custom", { days: plan.duration })
//     }
//   }

//   return (
//     <div className="bg-white dark:bg-gray-900">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
//             {t("subscriptionPlans.title")}
//           </h2>
//           <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">{t("subscriptionPlans.subtitle")}</p>
//         </div>
//         <div className="mt-8 flex justify-center items-center space-x-4">
//           <label htmlFor="country-select" className="text-xl font-bold text-blue-600 dark:text-blue-400">
//             {t("subscriptionPlans.chooseCountry")}
//           </label>
//           <Select value={selectedCountry} onValueChange={setSelectedCountry}>
//             <SelectTrigger id="country-select" className="w-[200px] bg-white dark:bg-gray-800">
//               <SelectValue placeholder={t("subscriptionPlans.selectCountry")} />
//             </SelectTrigger>
//             <SelectContent>
//               {countries.map((country) => (
//                 <SelectItem
//                   key={country.code}
//                   value={country.code}
//                   className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
//                 >
//                   <div className="flex items-center">
//                     <img
//                       src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
//                       alt={`Flag of ${country.name}`}
//                       className="mr-2"
//                       width={20}
//                       height={20}
//                     />
//                     {country.name}
//                   </div>
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
//           {plans.map((plan) => {
//             const Icon = icons[plan.duration as keyof typeof icons] || Clock
//             return (
//               <Card
//                 key={plan.id}
//                 className={`flex bg-white dark:bg-gray-800 flex-col justify-between rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 ${
//                   plan.popular ? "border-blue-500 border-2 scale-105" : ""
//                 }`}
//               >
//                 <CardHeader className="flex flex-col items-center">
//                   <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
//                     <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <CardTitle className="text-2xl font-semibold">{plan.name[i18n.language] || plan.name.en}</CardTitle>
//                   <CardDescription>{plan.description[i18n.language] || plan.description.en}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-center">
//                     <div className="mb-2">
//                       <span className="text-3xl font-extrabold">${getPrice(plan).discounted}</span>
//                       <span className="text-base font-medium text-gray-500 dark:text-gray-400">
//                         /{getPlanName(plan)}
//                       </span>
//                     </div>
//                     {plan.discount > 0 && (
//                       <div className="text-sm">
//                         <span className="line-through text-gray-500 dark:text-gray-400">
//                           ${getPrice(plan).original}
//                         </span>
//                         <span className="ml-2 font-medium text-red-500 dark:text-red-400">Save {plan.discount}%</span>
//                       </div>
//                     )}
//                   </div>
//                   <ul className="mt-6 space-y-2">
//                     {(plan.features[i18n.language] || plan.features.en).map((feature, index) => (
//                       <li key={index} className="flex items-start">
//                         <div className="flex-shrink-0">
//                           <Check className={`h-5 w-5 ${feature.included ? "text-blue-500" : "text-gray-300"}`} />
//                         </div>
//                         <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature.text}</p>
//                       </li>
//                     ))}
//                   </ul>
//                 </CardContent>
//                 <CardFooter>
//                   <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300">
//                     {plan.popular ? t("subscriptionPlans.getStarted") : t("subscriptionPlans.choosePlan")}
//                   </Button>
//                 </CardFooter>
//                 {plan.popular && (
//                   <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full transform rotate-12 shadow-lg">
//                     {t("subscriptionPlans.popular")}
//                   </div>
//                 )}
//               </Card>
//             )
//           })}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Main Component
// export default function SubscriptionAndTemporaryNumbers() {
//   const [countries, setCountries] = useState<Country[]>([])
//   const [services, setServices] = useState<Service[]>([])
//   const [plans, setPlans] = useState<Plan[]>([])
//   const [loading, setLoading] = useState(true)
//   const { t } = useTranslation()

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch countries
//         const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
//         const countriesSnapshot = await getDocs(countriesQuery)
//         const countriesData = countriesSnapshot.docs.map((doc) => ({
//           code: doc.id,
//           name: doc.data().name,
//           iso: doc.data().iso,
//         }))
//         setCountries(countriesData)

//         // Fetch services
//         const servicesQuery = query(collection(db, "services"), where("isIncluded", "==", true))
//         const servicesSnapshot = await getDocs(servicesQuery)
//         const servicesData = servicesSnapshot.docs.map((doc) => ({
//           name: doc.id,
//           main: doc.data().main || false,
//           isIncluded: doc.data().isIncluded || false,
//           price: doc.data().price || 0,
//           ...doc.data(),
//         })) as Service[]
//         setServices(servicesData)

//         // Fetch plans
//         const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
//         const plansData = plansSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Plan[]

//         const sortOrder = [7, 30, 90, 365]
//         plansData.sort((a, b) => sortOrder.indexOf(a.duration) - sortOrder.indexOf(b.duration))

//         setPlans(plansData)

//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching data:", error)
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   const getServicePrice = (serviceName: string, countryName: string | null) => {
//     // Implement your pricing logic here
//     // For now, we'll use a simple random price based on the service name and country
//     const basePrice = serviceName.length * 0.5
//     const countryMultiplier = countryName ? countryName.length * 0.1 : 1
//     return basePrice * countryMultiplier
//   }

//   const getSuccessRate = (serviceName: string) => {
//     // Implement your success rate logic here
//     // For now, we'll use a simple random success rate based on the service name
//     return Math.min(100, serviceName.length * 5 + Math.random() * 20)
//   }

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">{t("loading")}</div>
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
//       <Tabs defaultValue="subscription" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-900 rounded-lg p-2">
//           <TabsTrigger
//             value="subscription"
//             className="text-lg  font-semibold py-3 px-4  bg-blue-400 text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:bg-blue-700 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
//           >
//             <CreditCard className="w-5 h-5 mr-2 inline-block" />
//             {t("tabs.subscriptionPlans")}
//           </TabsTrigger>
//           <TabsTrigger
//             value="temporary"
//             className="text-lg font-semibold py-3 px-4  bg-blue-400 text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:bg-blue-700 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
//           >
//             <PhoneCall className="w-5 h-5 mr-2 inline-block" />
//             {t("tabs.temporaryNumbers")}
//           </TabsTrigger>
//         </TabsList>
//         <div className="mt-8">
//           <TabsContent value="subscription">
//             <SubscriptionPlansDisplay plans={plans} countries={countries} />
//           </TabsContent>
//           <TabsContent value="temporary">
//             <TemporaryNumbersTab
//               countries={countries}
//               services={services}
//               getServicePrice={getServicePrice}
//               getSuccessRate={getSuccessRate}
//             />
//           </TabsContent>
//         </div>
//       </Tabs>
//     </div>
//   )
// }

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Check,
  Clock,
  Calendar,
  CalendarDays,
  CalendarCheck,
  Search,
  Star,
  RefreshCcw,
  HelpCircle,
  X,
  CreditCard,
  PhoneCall,
} from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { db } from "../../firebase/config"
import { collection, getDocs, query, where } from "firebase/firestore"

// Types
interface Country {
  code: string
  name: string
  iso: string
}

interface Service {
  name: string
  main: boolean
  isIncluded: boolean
  price: number
}

interface PlanPrice {
  [countryCode: string]: number
}

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  id: string
  name: {
    [lang: string]: string
  }
  description: {
    [lang: string]: string
  }
  duration: number
  prices: PlanPrice
  features: {
    [lang: string]: PlanFeature[]
  }
  discount: number
  popular: boolean
}

// Icons for plan durations
const icons = {
  7: Clock,
  30: Calendar,
  90: CalendarDays,
  365: CalendarCheck,
}

// SelectedTile Component
function SelectedTile({
  item,
  onCancel,
  type,
  iso,
}: { item: any; onCancel: () => void; type: "country" | "service"; iso?: string }) {
  const [imageError, setImageError] = useState(false)
  const { t } = useTranslation()

  const getImageSrc = () => {
    if (type === "country") {
      return `https://flagcdn.com/w20/${iso?.toLowerCase()}.png`
    } else {
      return `https://logo.clearbit.com/${item.name.toLowerCase()}.com`
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-boxdark-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-3">
        {!imageError ? (
          <img
            src={getImageSrc() || "/placeholder.svg"}
            alt={type === "country" ? `Flag of ${item.name}` : `Icon of ${item.name}`}
            className="w-6 h-6 object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <HelpCircle className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <div className="flex flex-col">
          {type === "service" && (
            <span className="font-medium">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
          )}
          {type === "country" && <span className="font-medium">{t(`country.${iso}`)}</span>}
          <div className="flex space-x-2 text-sm">
            {type === "service" && item.price && (
              <span className="text-blue-500 dark:text-blue-400">
                {t("actionsidebar.Price")}: ${item.price.toFixed(2)}
              </span>
            )}
            {type === "service" && item.successRate !== null && item.successRate !== undefined && (
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
  )
}

// CountrySelector Component
function CountrySelector({
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
}: {
  selectedCountry: Country | null
  setSelectedCountry: (country: Country | null) => void
  countries: Country[]
  countrySearch: string
  setCountrySearch: (search: string) => void
  loadingCountries: boolean
  errorLoadingCountries: boolean
  fetchCountries: () => void
  favorites: { countries: Record<string, boolean> }
  toggleFavorite: (type: "countries" | "services", id: string) => void
  getSuccessRate: (countryName: string) => number | null
}) {
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("actionsidebar.1.Select country")}</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedCountry ? (
          <SelectedTile
            item={{
              ...selectedCountry,
              successRate: getSuccessRate(selectedCountry.name),
            }}
            onCancel={() => setSelectedCountry(null)}
            type="country"
            iso={selectedCountry.iso}
          />
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("actionsidebar.Find country")}
              className="pl-10 dark:bg-boxdark"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
          </div>
        )}

        {loadingCountries && <div>Loading...</div>}

        {errorLoadingCountries && !loadingCountries && (
          <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
            <span>{t("actionsidebar.Error loading countries")}</span>
            <Button onClick={fetchCountries} variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
            </Button>
          </div>
        )}

        {!selectedCountry && !loadingCountries && (
          <ScrollArea className="h-[300px] overflow-y-auto mt-4">
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
                          favorites.countries[country.name] ? "text-yellow-400" : "text-gray-400"
                        } cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite("countries", country.name)
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
                    </div>
                  </Button>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

// ServiceSelector Component
function ServiceSelector({
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
  getSuccessRate,
}: {
  selectedService: Service | null
  setSelectedService: (service: Service | null) => void
  services: Service[]
  serviceSearch: string
  setServiceSearch: (search: string) => void
  loadingServices: boolean
  errorLoadingServices: boolean
  fetchServices: () => void
  favorites: { services: Record<string, boolean> }
  toggleFavorite: (type: "countries" | "services", id: string) => void
  showMore: boolean
  setShowMore: (show: boolean) => void
  selectedCountry: Country | null
  getServicePrice: (serviceName: string, countryName: string | null) => number | null
  getSuccessRate: (serviceName: string) => number | null
}) {
  const mainServices = services.filter((service) => service.main && service.isIncluded)
  const includedServices = services.filter((service) => service.isIncluded)
  const [imageError, setImageError] = useState<Record<string, boolean>>({})
  const { t } = useTranslation()

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("actionsidebar.2.Select service")}</CardTitle>
      </CardHeader>
      <CardContent>
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

        {loadingServices && <div>Loading...</div>}

        {errorLoadingServices && !loadingServices && (
          <div className="bg-white dark:bg-boxdark border-red-200 rounded p-4 flex items-center justify-between">
            <span>{t("actionsidebar.Error loading services")}</span>
            <Button onClick={fetchServices} variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" /> {t("actionsidebar.Retry")}
            </Button>
          </div>
        )}

        {!selectedService && !loadingServices && (
          <ScrollArea className="h-[300px] overflow-y-auto mt-4">
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
                          favorites.services[service.name] ? "text-yellow-400" : "text-gray-400"
                        } cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite("services", service.name)
                        }}
                      />
                      <div className="w-5 h-5 mr-2 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                        {!imageError[service.name] ? (
                          <img
                            src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
                            alt={`Icon of ${service.name}`}
                            className="w-5 h-5 object-contain"
                            onError={() => {
                              setImageError((prev) => ({
                                ...prev,
                                [service.name]: true,
                              }))
                            }}
                          />
                        ) : (
                          <HelpCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <span className="flex-grow">{service.name.charAt(0).toUpperCase() + service.name.slice(1)}</span>
                      <div className="flex flex-col items-end">
                        <span className="text-sm text-blue-500 dark:text-blue-400">
                          {t("actionsidebar.Price")}: $
                          {(countrySpecificPrice !== null ? countrySpecificPrice : service.price).toFixed(2)}
                        </span>
                        {successRate !== null && (
                          <span className="text-sm text-green-500 dark:text-green-400">
                            {t("actionsidebar.Success")}:{successRate.toFixed(2)}%
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
          <Button onClick={() => setShowMore(!showMore)} variant="link" className="w-full text-blue-500 mt-2">
            {showMore
              ? t("actionsidebar.See Less", { count: mainServices.length })
              : t("actionsidebar.See More", { count: includedServices.length })}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// TemporaryNumbersTab Component
function TemporaryNumbersTab({
  countries,
  services,
  getServicePrice,
  getSuccessRate,
}: {
  countries: Country[]
  services: Service[]
  getServicePrice: (serviceName: string, countryName: string | null) => number | null
  getSuccessRate: (serviceName: string) => number | null
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [countrySearch, setCountrySearch] = useState("")
  const [serviceSearch, setServiceSearch] = useState("")
  const [showMore, setShowMore] = useState(false)
  const { t } = useTranslation()

  const price = selectedCountry && selectedService ? getServicePrice(selectedService.name, selectedCountry.name) : null
  const successRate = selectedService ? getSuccessRate(selectedService.name) : null

  return (
    <div className="grid grid-cols-1 mt-24 md:grid-cols-2 gap-6">
      <CountrySelector
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        countries={countries}
        countrySearch={countrySearch}
        setCountrySearch={setCountrySearch}
        loadingCountries={false}
        errorLoadingCountries={false}
        fetchCountries={() => {}}
        favorites={{ countries: {} }}
        toggleFavorite={() => {}}
        getSuccessRate={getSuccessRate}
      />
      <ServiceSelector
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        services={services}
        serviceSearch={serviceSearch}
        setServiceSearch={setServiceSearch}
        loadingServices={false}
        errorLoadingServices={false}
        fetchServices={() => {}}
        favorites={{ services: {} }}
        toggleFavorite={() => {}}
        showMore={showMore}
        setShowMore={setShowMore}
        selectedCountry={selectedCountry}
        getServicePrice={getServicePrice}
        getSuccessRate={getSuccessRate}
      />
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{t("temporaryNumbers.pricingAndSuccess")}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCountry && selectedService ? (
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">{t("temporaryNumbers.price")}</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${price?.toFixed(2) || t("temporaryNumbers.notAvailable")}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold">{t("temporaryNumbers.successRate")}</p>
                <p className="text-3xl font-bold text-green-600">
                  {successRate ? `${successRate.toFixed(2)}%` : t("temporaryNumbers.notAvailable")}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">{t("temporaryNumbers.selectCountryAndService")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// SubscriptionPlansDisplay Component
function SubscriptionPlansDisplay({ plans, countries }: { plans: Plan[]; countries: Country[] }) {
  const [selectedCountry, setSelectedCountry] = useState<string>(countries[0]?.code || "")
  const { t, i18n } = useTranslation()

  const getPrice = (plan: Plan) => {
    const originalPrice = plan.prices[selectedCountry] || Object.values(plan.prices)[0] || 0
    const discountedPrice = originalPrice * (1 - plan.discount / 100)
    return {
      original: originalPrice.toFixed(2),
      discounted: discountedPrice.toFixed(2),
    }
  }

  const getPlanName = (plan: Plan) => {
    switch (plan.duration) {
      case 7:
        return t("subscriptionPlans.weekly")
      case 30:
        return t("subscriptionPlans.monthly")
      case 90:
        return t("subscriptionPlans.quarterly")
      case 365:
        return t("subscriptionPlans.yearly")
      default:
        return t("subscriptionPlans.custom", { days: plan.duration })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            {t("subscriptionPlans.title")}
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">{t("subscriptionPlans.subtitle")}</p>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-4">
          <label htmlFor="country-select" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {t("subscriptionPlans.chooseCountry")}
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger
              id="country-select"
              className="w-[200px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            >
              <SelectValue placeholder={t("subscriptionPlans.selectCountry")} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
              {countries.map((country) => (
                <SelectItem
                  key={country.code}
                  value={country.code}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <img
                      src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
                      alt={`Flag of ${country.name}`}
                      className="mr-2"
                      width={20}
                      height={20}
                    />
                    {country.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
          {plans.map((plan) => {
            const Icon = icons[plan.duration as keyof typeof icons] || Clock
            return (
              <Card
                key={plan.id}
                className={`flex bg-white dark:bg-gray-800 flex-col justify-between rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-500 ${
                  plan.popular ? "border-blue-500 border-2 scale-105" : "border border-gray-200 dark:border-gray-700"
                }`}
              >
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">{plan.name[i18n.language] || plan.name.en}</CardTitle>
                  <CardDescription>{plan.description[i18n.language] || plan.description.en}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="mb-2">
                      <span className="text-3xl font-extrabold">${getPrice(plan).discounted}</span>
                      <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                        /{getPlanName(plan)}
                      </span>
                    </div>
                    {plan.discount > 0 && (
                      <div className="text-sm">
                        <span className="line-through text-gray-500 dark:text-gray-400">
                          ${getPrice(plan).original}
                        </span>
                        <span className="ml-2 font-medium text-red-500 dark:text-red-400">Save {plan.discount}%</span>
                      </div>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2">
                    {(plan.features[i18n.language] || plan.features.en).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className={`h-5 w-5 ${feature.included ? "text-blue-500" : "text-gray-300"}`} />
                        </div>
                        <p className="ml-3 text-base text-gray-700 dark:text-gray-300">{feature.text}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300">
                    {plan.popular ? t("subscriptionPlans.getStarted") : t("subscriptionPlans.choosePlan")}
                  </Button>
                </CardFooter>
                {plan.popular && (
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full transform rotate-12 shadow-lg">
                    {t("subscriptionPlans.popular")}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Main Component
export default function SubscriptionAndTemporaryNumbers() {
  const [countries, setCountries] = useState<Country[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
        const countriesSnapshot = await getDocs(countriesQuery)
        const countriesData = countriesSnapshot.docs.map((doc) => ({
          code: doc.id,
          name: doc.data().name,
          iso: doc.data().iso,
        }))
        setCountries(countriesData)

        // Fetch services
        const servicesQuery = query(collection(db, "services"), where("isIncluded", "==", true))
        const servicesSnapshot = await getDocs(servicesQuery)
        const servicesData = servicesSnapshot.docs.map((doc) => ({
          name: doc.id,
          main: doc.data().main || false,
          isIncluded: doc.data().isIncluded || false,
          price: doc.data().price || 0,
          ...doc.data(),
        })) as Service[]
        setServices(servicesData)

        // Fetch plans
        const plansSnapshot = await getDocs(collection(db, "subscription_plans"))
        const plansData = plansSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plan[]

        const sortOrder = [7, 30, 90, 365]
        plansData.sort((a, b) => sortOrder.indexOf(a.duration) - sortOrder.indexOf(b.duration))

        setPlans(plansData)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getServicePrice = (serviceName: string, countryName: string | null) => {
    // Implement your pricing logic here
    // For now, we'll use a simple random price based on the service name and country
    const basePrice = serviceName.length * 0.5
    const countryMultiplier = countryName ? countryName.length * 0.1 : 1
    return basePrice * countryMultiplier
  }

  const getSuccessRate = (serviceName: string) => {
    // Implement your success rate logic here
    // For now, we'll use a simple random success rate based on the service name
    return Math.min(100, serviceName.length * 5 + Math.random() * 20)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">{t("loading")}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900">
      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-white dark:bg-gray-900 rounded-lg p-2">
          <TabsTrigger
            value="subscription"
            className="text-lg  font-semibold py-3 px-4  bg-blue-400 text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:bg-blue-700 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
          >
            <CreditCard className="w-5 h-5 mr-2 inline-block" />
            {t("tabs.subscriptionPlans")}
          </TabsTrigger>
          <TabsTrigger
            value="temporary"
            className="text-lg font-semibold py-3 px-4  bg-blue-400 text-white data-[state=active]:bg-blue-700 data-[state=active]:text-white dark:bg-blue-700 dark:data-[state=active]:bg-blue-900 transition-all duration-200"
          >
            <PhoneCall className="w-5 h-5 mr-2 inline-block" />
            {t("tabs.temporaryNumbers")}
          </TabsTrigger>
        </TabsList>
        <div className="mt-8">
          <TabsContent value="subscription">
            <SubscriptionPlansDisplay plans={plans} countries={countries} />
          </TabsContent>
          <TabsContent value="temporary" className="pb-12">
            <TemporaryNumbersTab
              countries={countries}
              services={services}
              getServicePrice={getServicePrice}
              getSuccessRate={getSuccessRate}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

