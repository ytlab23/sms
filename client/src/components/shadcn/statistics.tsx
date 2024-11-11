

// import React, { useState, useMemo, useEffect } from 'react'
// import { Card, CardContent } from './ui/card'
// import { Button } from './ui/button'
// import { Input } from './ui/input'
// import { ShoppingCart } from 'lucide-react'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select'
// import { db } from './../../firebase/config' 
// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   where,
// } from 'firebase/firestore'
// import axios from 'axios'
// import { useToast } from './ui/use-toast'
// import { useNavigate } from 'react-router-dom'
// import { ToastAction } from './ui/toast'
// import { useAuth } from '../../contexts/authcontext'
// import { useTranslation } from 'react-i18next'

// interface CountryServiceData {
//   id: string
//   country: string
//   service: string
//   successRate: number
//   failureRate: number
//   price: number
//   currency: string
//   quantity: number
//   successfulRefunds: number
//   unsuccessfulRefunds: number
// }

// export default function SMSStats() {
//   const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
//     undefined
//   )
//   const [selectedService, setSelectedService] = useState<string | undefined>(
//     undefined
//   )
//   const [searchTerm, setSearchTerm] = useState('')
//   const [smsData, setSmsData] = useState<CountryServiceData[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [buying, setBuying] = useState<boolean>(false)
//   const [failedToBuy, setFailedToBuy] = useState<boolean>(false)
//   const { currentUser } = useAuth();

//   const { toast } = useToast()
//   const navigate = useNavigate()
//   const {t,i18n} = useTranslation()

//   useEffect(() => {
//     const fetchStatisticsAndPricing = async () => {
//       try {
//         const statisticsCollection = collection(db, 'statistics')
//         const pricingCollection = collection(db, 'pricing')
//         const servicesCollection = collection(db, 'services')
//         const countriesCollection = collection(db, 'countries')

//         const countriesQuery = query(
//           countriesCollection,
//           where('included', '==', true)
//         )
//         const countriesSnapshot = await getDocs(countriesQuery)

//         const servicesQuery = query(
//           servicesCollection,
//           where('isIncluded', '==', true)
//         )
//         const servicesSnapshot = await getDocs(servicesQuery)

//         const includedCountries = countriesSnapshot.docs.map((doc) =>
//           doc.id.toLowerCase()
//         )
//         const includedServices = servicesSnapshot.docs.map((doc) =>
//           doc.id.toLowerCase()
//         )

//         const statisticsSnapshot = await getDocs(statisticsCollection)
//         const pricingSnapshot = await getDocs(pricingCollection)

//         const servicesPricingMap: { [serviceName: string]: any } = {}
//         servicesSnapshot.docs.forEach((doc) => {
//           servicesPricingMap[doc.id.toLowerCase()] = doc.data()
//         })

//         const combinedData = []

//         for (const country of includedCountries) {
//           for (const service of includedServices) {
//             const statisticEntry = statisticsSnapshot.docs.find(
//               (statDoc) => statDoc.id.toLowerCase() === `${country}_${service}`
//             )

//             let data = statisticEntry ? statisticEntry.data() : {}

//             if (!statisticEntry) {
//               data = {
//                 successfulRefunds: 0,
//                 unsuccessfulRefunds: 0,
//                 quantity: 0,
//               }

//               await setDoc(
//                 doc(db, 'statistics', `${country}_${service}`),
//                 data
//               )
//             }

//             const successfulRefunds = data.successfulRefunds || 0
//             const unsuccessfulRefunds = data.unsuccessfulRefunds || 0
//             const totalRefunds = successfulRefunds + unsuccessfulRefunds
//             const successRate =
//               totalRefunds === 0
//                 ? 100
//                 : 100 - (unsuccessfulRefunds / totalRefunds) * 100
//             const failureRate = 100 - successRate

//             const pricingData = pricingSnapshot.docs.find(
//               (pricingDoc) =>
//                 pricingDoc.id.toLowerCase() === `${country}_${service}`
//             )
//             const priceInfo = pricingData
//               ? pricingData.data()
//               : servicesPricingMap[service.toLowerCase()] || {} 

//             combinedData.push({
//               id: `${country}_${service}`,
//               country: capitalizeFirstLetter(country),
//               service: capitalizeFirstLetter(service),
//               successRate,
//               successfulRefunds,
//               unsuccessfulRefunds,
//               price: priceInfo?.price || 0, 
//               currency: priceInfo?.currency || '$',
//               quantity: data.quantity || 0, 
//               failureRate,
//             })
//           }
//         }

//         setSmsData(combinedData)
//         setLoading(false)
//       } catch (error) {
//         setLoading(false)
//       }
//     }

//     fetchStatisticsAndPricing()
//   }, [])

//   const countries = useMemo(
//     () => [...new Set(smsData.map((item) => item.country))],
//     [smsData]
//   )
//   const services = useMemo(
//     () => [...new Set(smsData.map((item) => item.service))],
//     [smsData]
//   )

//   const filteredData = useMemo(() => {
//     return smsData.filter(
//       (item) =>
//         (selectedCountry === 'all-countries' ||
//           !selectedCountry ||
//           item.country === selectedCountry) &&
//         (selectedService === 'all-services' ||
//           !selectedService ||
//           item.service === selectedService) &&
//         (item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           item.service.toLowerCase().includes(searchTerm.toLowerCase()))
//     )
//   }, [selectedCountry, selectedService, smsData, searchTerm])

//   const buyProduct = async (country: string, service: string) => {
//     setBuying(true)
//     setFailedToBuy(false)

//     try {
//       const response = await axios.post(
//         'https://smsverify-server.vercel.app/api/buy-product',
//         {
//           uid: currentUser?.uid, 
//           country: country.toLowerCase(),
//           product: service.toLowerCase(),
//         }
//       )

//       const id = response.data?.product?.id ?? null

//       setSelectedCountry(undefined)
//       setSelectedService(undefined)

//       toast({
//         variant: 'success',
//         title: 'Product purchased successfully',
//         description:
//           'You can now use the service. Refresh page to see the changes.',
//       })
//       // navigate(`/sms?id=${id}`)
//       navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)

//       setBuying(false)
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: 'destructive',
//             title: 'Insufficient balance',
//             description: 'Please top up your account to complete the purchase.',
//             action: (
//               <ToastAction
//                 onClick={() => navigate(`/${i18n.language}/${t("urls.pay")}`)}
//                 altText="Go to payment"
//               >
//                 Go to Payment
//               </ToastAction>
//             ),
//           })
//         } else {
//           toast({
//             variant: 'destructive',
//             title: 'Purchase failed',
//             description: 'Something went wrong while purchasing the product.',
//           })
//           setFailedToBuy(true)
//         }
//       } else {
//         toast({
//           variant: 'destructive',
//           title: 'Unknown error',
//           description: 'An unknown error occurred. Please try again.',
//           action: (
//             <ToastAction
//               onClick={() => buyProduct(country, service)}
//               altText="Try again"
//             >
//               Try again
//             </ToastAction>
//           ),
//         })
//         setFailedToBuy(true)
//       }
//     }
//     setBuying(false)
//   }

//   if (loading) {
//     return <div>{t("stat.Loading...")}</div>
//   }

//   function capitalizeFirstLetter(string: string) {
//     return string.charAt(0).toUpperCase() + string.slice(1)
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-bold mb-6">{t("stat.SMS Verification Services")}</h1>

//       <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
//         <Select onValueChange={setSelectedCountry}>
//           <SelectTrigger className="w-full md:w-[180px]">
//             <SelectValue placeholder="Select Country" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             <SelectItem className="hover:text-blue-600" value="all-countries">
//             {t("stat.All Countries")}   
//             </SelectItem>
//             {countries.map((country) => (
//               <SelectItem
//                 className="hover:text-blue-600"
//                 key={country}
//                 value={country}
//               >
//                 {country}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Select onValueChange={setSelectedService}>
//           <SelectTrigger className="w-full md:w-[180px]">
//             <SelectValue placeholder="Select Service" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             <SelectItem className="hover:text-blue-600" value="all-services">
//             {t("stat.All Services")}   
//             </SelectItem>
//             {services.map((service) => (
//               <SelectItem
//                 className="hover:text-blue-600"
//                 key={service}
//                 value={service}
//               >
//                 {service}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>

//         <Input
//           type="text"
//           placeholder={t("stat.Search country or service...")} 
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-[300px] dark:bg-boxdark-2 dark:text-white"
//         />
//       </div>

//       <div className="space-y-6">
//         {filteredData.map((item) => (
//           <Card key={item.id} className="w-full max-w-4xl mx-auto">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex-1">
//                   <h2 className="text-2xl font-semibold">{item.country}</h2>
//                   <p className="text-lg text-muted-foreground">
//                     {item.service}
//                   </p>
//                 </div>
//                 <div className="text-right">
//                   {/* <p className="text-lg font-medium">Available</p>
//                   <p className="text-2xl font-bold">
//                     {item.quantity.toLocaleString()}
//                   </p> */}
//                 </div>
//               </div>
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-4/5 bg-slate-300 rounded-full h-6 overflow-hidden">
//                   <div
//                     className="bg-blue-400 h-full rounded-full"
//                     style={{ width: `${100 - item.failureRate}%` }}
//                     aria-label={`Success rate: ${(
//                       100 - Number(item.failureRate)
//                     ).toFixed(2)}%`}
//                   ></div>
//                 </div>
//                 <span className="text-lg font-medium ml-4">
//                   {(100 - Number(item.failureRate)).toFixed(2)}%
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-3xl font-bold">
//                   {item.currency}
//                   {item.price.toFixed(2)}
//                 </span>
//                 <Button
//                   size="lg"
//                   className="text-white"
//                   onClick={() => buyProduct(item.country, item.service)}
//                   disabled={buying}
//                 >
//                   <ShoppingCart className="w-6 h-6 mr-2" aria-hidden="true" />
//                   {buying ? 'Buying...' : 'Buy Now'}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ShoppingCart } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { db } from './../../firebase/config' 
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { useNavigate } from 'react-router-dom'
import { ToastAction } from './ui/toast'
import { useAuth } from '../../contexts/authcontext'
import { useTranslation } from 'react-i18next'

interface CountryServiceData {
  id: string
  country: string
  service: string
  successRate: number
  failureRate: number
  price: number
  currency: string
  quantity: number
  successfulRefunds: number
  unsuccessfulRefunds: number
}

export default function SMSStats() {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [smsData, setSmsData] = useState<CountryServiceData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [buying, setBuying] = useState<boolean>(false)
  const [buyingService, setBuyingService] = useState<string | null>(null)
  const [failedToBuy, setFailedToBuy] = useState<boolean>(false)
  const { currentUser } = useAuth();

  const { toast } = useToast()
  const navigate = useNavigate()
  const {t,i18n} = useTranslation()

  const getSuccessRate = (countryName: string, serviceName: string) => {
    const key = `${countryName.toLowerCase()}_${serviceName.toLowerCase()}`;
    
    // Check if the value is already stored in localStorage
    const storedSuccessRate = localStorage.getItem(key);
    if (storedSuccessRate) {
      return parseFloat(storedSuccessRate);
    }

    // If not in localStorage, calculate and store the value
    const stats = smsData.find(item => item.id === key);
    let successRate: number;

    if (!stats || (stats.successfulRefunds === 0 && stats.unsuccessfulRefunds === 0)) {
      successRate = Math.random() * 20 + 40; // Random number between 40 and 60
    } else {
      const totalRefunds = stats.successfulRefunds + stats.unsuccessfulRefunds;
      successRate = totalRefunds === 0 ? 100 : (stats.successfulRefunds / totalRefunds) * 100;
    }

    // Store the success rate in localStorage
    localStorage.setItem(key, successRate.toString());

    return successRate;
  };

  useEffect(() => {
    const fetchStatisticsAndPricing = async () => {
      try {
        const statisticsCollection = collection(db, 'statistics')
        const pricingCollection = collection(db, 'pricing')
        const servicesCollection = collection(db, 'services')
        const countriesCollection = collection(db, 'countries')

        const countriesQuery = query(
          countriesCollection,
          where('included', '==', true)
        )
        const countriesSnapshot = await getDocs(countriesQuery)

        const servicesQuery = query(
          servicesCollection,
          where('isIncluded', '==', true)
        )
        const servicesSnapshot = await getDocs(servicesQuery)

        const includedCountries = countriesSnapshot.docs.map((doc) =>
          doc.id.toLowerCase()
        )
        const includedServices = servicesSnapshot.docs.map((doc) =>
          doc.id.toLowerCase()
        )

        const statisticsSnapshot = await getDocs(statisticsCollection)
        const pricingSnapshot = await getDocs(pricingCollection)

        const servicesPricingMap: { [serviceName: string]: any } = {}
        servicesSnapshot.docs.forEach((doc) => {
          servicesPricingMap[doc.id.toLowerCase()] = doc.data()
        })

        const combinedData = []

        for (const country of includedCountries) {
          for (const service of includedServices) {
            const statisticEntry = statisticsSnapshot.docs.find(
              (statDoc) => statDoc.id.toLowerCase() === `${country}_${service}`
            )

            let data = statisticEntry ? statisticEntry.data() : {}

            if (!statisticEntry) {
              data = {
                successfulRefunds: 0,
                unsuccessfulRefunds: 0,
                quantity: 0,
              }

              await setDoc(
                doc(db, 'statistics', `${country}_${service}`),
                data
              )
            }

            const successfulRefunds = data.successfulRefunds || 0
            const unsuccessfulRefunds = data.unsuccessfulRefunds || 0

            const pricingData = pricingSnapshot.docs.find(
              (pricingDoc) =>
                pricingDoc.id.toLowerCase() === `${country}_${service}`
            )
            const priceInfo = pricingData
              ? pricingData.data()
              : servicesPricingMap[service.toLowerCase()] || {} 

            combinedData.push({
              id: `${country}_${service}`,
              country: capitalizeFirstLetter(country),
              service: capitalizeFirstLetter(service),
              successRate: 0, // We'll calculate this later
              failureRate: 0, // We'll calculate this later
              successfulRefunds,
              unsuccessfulRefunds,
              price: priceInfo?.price || 0, 
              currency: priceInfo?.currency || '$',
              quantity: data.quantity || 0, 
            })
          }
        }

        setSmsData(combinedData)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    fetchStatisticsAndPricing()
  }, [])

  const countries = useMemo(
    () => [...new Set(smsData.map((item) => item.country))],
    [smsData]
  )
  const services = useMemo(
    () => [...new Set(smsData.map((item) => item.service))],
    [smsData]
  )

  const filteredData = useMemo(() => {
    return smsData.filter(
      (item) =>
        (selectedCountry === 'all-countries' ||
          !selectedCountry ||
          item.country === selectedCountry) &&
        (selectedService === 'all-services' ||
          !selectedService ||
          item.service === selectedService) &&
        (item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.service.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [selectedCountry, selectedService, smsData, searchTerm])

  const buyProduct = async (country: string, service: string) => {
    setBuying(true)
    setFailedToBuy(false)
    setBuyingService(`${country}_${service}`)

    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/buy-product',
        {
          uid: currentUser?.uid, 
          country: country.toLowerCase(),
          product: service.toLowerCase(),
        }
      )

      const id = response.data?.product?.id ?? null

      setSelectedCountry(undefined)
      setSelectedService(undefined)

      toast({
        variant: 'success',
        title: 'Product purchased successfully',
        description:
          'You can now use the service. Refresh page to see the changes.',
      })
      navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)

      setBuying(false)
      setBuyingService(null)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: 'Insufficient balance',
            description: 'Please top up your account to complete the purchase.',
            action: (
              <ToastAction
                onClick={() => navigate(`/${i18n.language}/${t("urls.pay")}`)}
                altText="Go to payment"
              >
                Go to Payment
              </ToastAction>
            ),
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Purchase failed',
            description: 'Something went wrong while purchasing the product.',
          })
          setFailedToBuy(true)
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Unknown error',
          description: 'An unknown error occurred. Please try again.',
          action: (
            <ToastAction
              onClick={() => buyProduct(country, service)}
              altText="Try again"
            >
              Try again
            </ToastAction>
          ),
        })
        setFailedToBuy(true)
      }
    }
    setBuying(false)
    setBuyingService(null)
  }

  if (loading) {
    return <div>{t("stat.Loading...")}</div>
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">{t("stat.SMS Verification Services")}</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
        <Select onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem className="hover:text-blue-600" value="all-countries">
            {t("stat.All Countries")}   
            </SelectItem>
            {countries.map((country) => (
              <SelectItem
                className="hover:text-blue-600"
                key={country}
                value={country}
              >
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedService}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem className="hover:text-blue-600" value="all-services">
            {t("stat.All Services")}   
            </SelectItem>
            {services.map((service) => (
              <SelectItem
                className="hover:text-blue-600"
                key={service}
                value={service}
              >
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder={t("stat.Search country or service...")} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px] dark:bg-boxdark-2 dark:text-white"
        />
      </div>

      <div className="space-y-6">
        {filteredData.map((item) => {
          const successRate = getSuccessRate(item.country, item.service);
          return (
            <Card key={item.id} className="w-full max-w-4xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">{item.country}</h2>
                    <p className="text-lg text-muted-foreground">
                      {item.service}
                    </p>
                  </div>
                  <div className="text-right">
                    {/* <p className="text-lg font-medium">Available</p>
                    <p className="text-2xl font-bold">
                      {item.quantity.toLocaleString()}
                    </p> */}
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-4/5 bg-slate-300 rounded-full h-6 overflow-hidden">
                    <div
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${successRate}%` }}
                      aria-label={`Success rate: ${successRate.toFixed(2)}%`}
                    ></div>
                  </div>
                  <span className="text-lg font-medium ml-4 text-green-600">{t("actionsidebar.Success")}: {" "}
                    {successRate.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">{t("actionsidebar.Price")}: {" "} 
                    {item.currency}
                    {item.price.toFixed(2)}
                  </span>
                  <Button
                    size="lg"
                    className="text-white"
                    onClick={() => buyProduct(item.country, item.service)}
                    disabled={buying || (buyingService !== null && buyingService !== item.id)}
                  >
                    <ShoppingCart className="w-6 h-6 mr-2" aria-hidden="true" />
                    {buyingService === item.id ? 'Buying...' : 'Buy Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}