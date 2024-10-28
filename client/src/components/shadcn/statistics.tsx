

// import React, { useState, useMemo, useEffect } from 'react';
// import { Card, CardContent } from './ui/card';
// import { Button } from './ui/button';
// import { ShoppingCart } from 'lucide-react';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select';
// import { db } from '../../firebase/config'; // Replace with your Firebase config
// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   setDoc,
//   where,
// } from 'firebase/firestore';

// interface CountryServiceData {
//   id: string;
//   country: string;
//   service: string;
//   successRate: number;
//   failureRate: number;
//   price: number;
//   currency: string;
//   quantity: number;
//   successfulRefunds: number;
//   unsuccessfulRefunds: number;
// }

// export default function SMSStats() {
//   const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
//     undefined,
//   );
//   const [selectedService, setSelectedService] = useState<string | undefined>(
//     undefined,
//   );
//   const [smsData, setSmsData] = useState<CountryServiceData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

  
//   useEffect(() => {
//     const fetchStatisticsAndPricing = async () => {
//       try {
//         const statisticsCollection = collection(db, 'statistics');
//         const pricingCollection = collection(db, 'pricing');
//         const servicesCollection = collection(db, 'services');
//         const countriesCollection = collection(db, 'countries');

//         // Fetch countries where 'included' is true
//         const countriesQuery = query(
//           countriesCollection,
//           where('included', '==', true),
//         );
//         const countriesSnapshot = await getDocs(countriesQuery);

//         // Fetch services where 'isIncluded' is true
//         const servicesQuery = query(
//           servicesCollection,
//           where('isIncluded', '==', true),
//         );
//         const servicesSnapshot = await getDocs(servicesQuery);

//         const includedCountries = countriesSnapshot.docs.map((doc) =>
//           doc.id.toLowerCase(),
//         );
//         const includedServices = servicesSnapshot.docs.map((doc) =>
//           doc.id.toLowerCase(),
//         );

//         const statisticsSnapshot = await getDocs(statisticsCollection);
//         const pricingSnapshot = await getDocs(pricingCollection);

//         // Map services for pricing fallback
//         const servicesPricingMap: { [serviceName: string]: any } = {};
//         servicesSnapshot.docs.forEach((doc) => {
//           servicesPricingMap[doc.id.toLowerCase()] = doc.data();
//         });

//         const combinedData = [];

//         // Loop through each included country and service to build the combination
//         for (const country of includedCountries) {
//           for (const service of includedServices) {
//             // Check if there's an existing entry in statistics
//             const statisticEntry = statisticsSnapshot.docs.find(
//               (statDoc) => statDoc.id.toLowerCase() === `${country}_${service}`,
//             );

//             let data = statisticEntry ? statisticEntry.data() : {};

//             // If no entry in statistics, create a default one
//             if (!statisticEntry) {
//               data = {
//                 successfulRefunds: 0,
//                 unsuccessfulRefunds: 0,
//                 quantity: 0,
//               };

//               // Create a new document in statistics with the default values
//               await setDoc(
//                 doc(db, 'statistics', `${country}_${service}`),
//                 data,
//               );
//             }

//             const successfulRefunds = data.successfulRefunds || 0;
//             const unsuccessfulRefunds = data.unsuccessfulRefunds || 0;
//             const totalRefunds = successfulRefunds + unsuccessfulRefunds;
//             const successRate =
//               totalRefunds === 0
//                 ? 100
//                 : 100 - (unsuccessfulRefunds / totalRefunds) * 100;
//             const failureRate = 100 - successRate;

//             // Find matching pricing data for the country_service combination
//             const pricingData = pricingSnapshot.docs.find(
//               (pricingDoc) =>
//                 pricingDoc.id.toLowerCase() === `${country}_${service}`,
//             );
//             const priceInfo = pricingData
//               ? pricingData.data()
//               : servicesPricingMap[service.toLowerCase()] || {}; // Fallback to service pricing

//             // Build the combined data entry
//             combinedData.push({
//               id: `${country}_${service}`,
//               country,
//               service,
//               successRate,
//               successfulRefunds,
//               unsuccessfulRefunds,
//               price: priceInfo?.price || 0, // Default price if no pricing found
//               currency: priceInfo?.currency || '$', // Default currency
//               quantity: data.quantity || 0, // Quantity
//               failureRate,
//             });
//           }
//         }

//         setSmsData(combinedData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data from Firestore:', error);
//         setLoading(false);
//       }
//     };

//     fetchStatisticsAndPricing();
//   }, []);

//   const countries = useMemo(
//     () => [...new Set(smsData.map((item) => item.country))],
//     [smsData],
//   );
//   const services = useMemo(
//     () => [...new Set(smsData.map((item) => item.service))],
//     [smsData],
//   );

//   const filteredData = useMemo(() => {
//     return smsData.filter(
//       (item) =>
//         (selectedCountry === 'all-countries' ||
//           !selectedCountry ||
//           item.country === selectedCountry) &&
//         (selectedService === 'all-services' ||
//           !selectedService ||
//           item.service === selectedService),
//     );
//   }, [selectedCountry, selectedService, smsData]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-bold mb-6">SMS Verification Services</h1>

//       <div className="flex space-x-4 mb-6">
//         <Select onValueChange={setSelectedCountry}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select Country" />
//           </SelectTrigger>
//           <SelectContent className="bg-whiten">
//             <SelectItem className="hover:text-blue-600" value="all-countries">
//               All Countries
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
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select Service" />
//           </SelectTrigger>
//           <SelectContent className="bg-whiten">
//             <SelectItem className="hover:text-blue-600" value="all-services">
//               All Services
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
//               {/* <div className="flex items-center justify-between mb-4">
//                 <p className="text-lg">
//                   Successful Refunds: {item.successfulRefunds}
//                 </p>
//                 <p className="text-lg">
//                   Unsuccessful Refunds: {item.unsuccessfulRefunds}
//                 </p>
//               </div> */}
//               <div className="flex items-center justify-between">
//                 <span className="text-3xl font-bold">
//                   {item.currency}
//                   {item.price.toFixed(2)}
//                 </span>
//                 <Button size="lg" className="text-white">
//                   <ShoppingCart className="w-6 h-6 mr-2" aria-hidden="true" />
//                   Buy Now
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
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
import { db } from './../../firebase/config' // Replace with your Firebase config
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
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined
  )
  const [selectedService, setSelectedService] = useState<string | undefined>(
    undefined
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [smsData, setSmsData] = useState<CountryServiceData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [buying, setBuying] = useState<boolean>(false)
  const [failedToBuy, setFailedToBuy] = useState<boolean>(false)
  const { currentUser } = useAuth();

  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchStatisticsAndPricing = async () => {
      try {
        const statisticsCollection = collection(db, 'statistics')
        const pricingCollection = collection(db, 'pricing')
        const servicesCollection = collection(db, 'services')
        const countriesCollection = collection(db, 'countries')

        // Fetch countries where 'included' is true
        const countriesQuery = query(
          countriesCollection,
          where('included', '==', true)
        )
        const countriesSnapshot = await getDocs(countriesQuery)

        // Fetch services where 'isIncluded' is true
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

        // Map services for pricing fallback
        const servicesPricingMap: { [serviceName: string]: any } = {}
        servicesSnapshot.docs.forEach((doc) => {
          servicesPricingMap[doc.id.toLowerCase()] = doc.data()
        })

        const combinedData = []

        // Loop through each included country and service to build the combination
        for (const country of includedCountries) {
          for (const service of includedServices) {
            // Check if there's an existing entry in statistics
            const statisticEntry = statisticsSnapshot.docs.find(
              (statDoc) => statDoc.id.toLowerCase() === `${country}_${service}`
            )

            let data = statisticEntry ? statisticEntry.data() : {}

            // If no entry in statistics, create a default one
            if (!statisticEntry) {
              data = {
                successfulRefunds: 0,
                unsuccessfulRefunds: 0,
                quantity: 0,
              }

              // Create a new document in statistics with the default values
              await setDoc(
                doc(db, 'statistics', `${country}_${service}`),
                data
              )
            }

            const successfulRefunds = data.successfulRefunds || 0
            const unsuccessfulRefunds = data.unsuccessfulRefunds || 0
            const totalRefunds = successfulRefunds + unsuccessfulRefunds
            const successRate =
              totalRefunds === 0
                ? 100
                : 100 - (unsuccessfulRefunds / totalRefunds) * 100
            const failureRate = 100 - successRate

            // Find matching pricing data for the country_service combination
            const pricingData = pricingSnapshot.docs.find(
              (pricingDoc) =>
                pricingDoc.id.toLowerCase() === `${country}_${service}`
            )
            const priceInfo = pricingData
              ? pricingData.data()
              : servicesPricingMap[service.toLowerCase()] || {} // Fallback to service pricing

            // Build the combined data entry
            combinedData.push({
              id: `${country}_${service}`,
              country: capitalizeFirstLetter(country),
              service: capitalizeFirstLetter(service),
              successRate,
              successfulRefunds,
              unsuccessfulRefunds,
              price: priceInfo?.price || 0, // Default price if no pricing found
              currency: priceInfo?.currency || '$', // Default currency
              quantity: data.quantity || 0, // Quantity
              failureRate,
            })
          }
        }

        setSmsData(combinedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data from Firestore:', error)
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
    console.log('buying product', country, service)

    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/buy-product',
        {
          uid: currentUser?.uid, // Replace with actual user ID
          country: country.toLowerCase(),
          product: service.toLowerCase(),
        }
      )

      const id = response.data?.product?.id ?? null

      // Reset the selected states
      setSelectedCountry(undefined)
      setSelectedService(undefined)

      // Success toast notification
      toast({
        variant: 'success',
        title: 'Product purchased successfully',
        description:
          'You can now use the service. Refresh page to see the changes.',
      })
      navigate(`/sms?id=${id}`)
      setBuying(false)
    } catch (error: any) {
      // Handle different error types
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          // Insufficient balance toast
          toast({
            variant: 'destructive',
            title: 'Insufficient balance',
            description: 'Please top up your account to complete the purchase.',
            action: (
              <ToastAction
                onClick={() => navigate('/pay')}
                altText="Go to payment"
              >
                Go to Payment
              </ToastAction>
            ),
          })
        } else {
          // General Axios error
          toast({
            variant: 'destructive',
            title: 'Purchase failed',
            description: 'Something went wrong while purchasing the product.',
          })
          setFailedToBuy(true)
        }
      } else {
        // Non-Axios or unknown errors
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
      console.error('Error purchasing product:', error)
    }
    setBuying(false)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">SMS Verification Services</h1>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0 mb-6">
        <Select onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem className="hover:text-blue-600" value="all-countries">
              All Countries
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
              All Services
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
          placeholder="Search country or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-[300px]"
        />
      </div>

      <div className="space-y-6">
        {filteredData.map((item) => (
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
                    style={{ width: `${100 - item.failureRate}%` }}
                    aria-label={`Success rate: ${(
                      100 - Number(item.failureRate)
                    ).toFixed(2)}%`}
                  ></div>
                </div>
                <span className="text-lg font-medium ml-4">
                  {(100 - Number(item.failureRate)).toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {item.currency}
                  {item.price.toFixed(2)}
                </span>
                <Button
                  size="lg"
                  className="text-white"
                  onClick={() => buyProduct(item.country, item.service)}
                  disabled={buying}
                >
                  <ShoppingCart className="w-6 h-6 mr-2" aria-hidden="true" />
                  {buying ? 'Buying...' : 'Buy Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}