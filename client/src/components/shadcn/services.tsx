

// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ChevronDown, ChevronUp, Check } from 'lucide-react';
// import { Button } from './ui/button';
// import { Card, CardContent } from './ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
// import { db } from '../../firebase/config'; // Ensure you import your Firestore config

// const countries: { value: string; label: string }[] = [
//   { value: 'us', label: 'United States' },
//   { value: 'uk', label: 'United Kingdom' },
//   { value: 'ca', label: 'Canada' },
//   { value: 'au', label: 'Australia' },
//   { value: 'de', label: 'Germany' },
//   { value: 'fr', label: 'France' },
// ];

// // export default function InternalPage() {
// //   const { slug } = useParams();
// //   interface PageData {
// //     heading: string;
// //     bodyText: string;
// //     features: string[];
// //     ctaText: string;
// //     faqs: { question: string; answer: string }[];
// //   }

// //   const [pageData, setPageData] = useState<PageData | null>(null); // State for page data
// //   const [loading, setLoading] = useState(true); // Loading state
// //   const [openFaq, setOpenFaq] = useState<number | null>(null);
// //   const [selectedCountry, setSelectedCountry] = useState<string>('');

// //   // Fetch the page data from Firestore
// //   useEffect(() => {
// //     const fetchPageData = async () => {
// //       try {
// //         if (!slug) {
// //           throw new Error('Slug is undefined');
// //         }
// //         const pageRef = doc(db, 'internal_pages', slug);
// //         const pageSnapshot = await getDoc(pageRef);
// //         if (pageSnapshot.exists()) {
// //           const data = pageSnapshot.data();
// //           setPageData(data.en); // Assuming the data for English is under the 'en' key
// //         } else {
// //           console.error('No such page!');
// //         }
// //       } catch (error) {
// //         console.error('Error fetching page data:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (slug) {
// //       fetchPageData();
// //     }
// //   }, [slug]);

// //   if (loading) {
// //     return <p>Loading...</p>;
// //   }

// //   if (!pageData) {
// //     return <p>Page not found</p>;
// //   }

// //   const handleBuyNumber = () => {
// //     if (selectedCountry) {
// //       console.log(`Buying number for Google verification in ${selectedCountry}`);
// //       // Here you would typically redirect to a checkout page or open a modal
// //     } else {
// //       alert('Please select a country first');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
// //       <header className="bg-blue-600 text-white py-6">
// //         <div className="container mx-auto px-4">
// //           <h1 className="text-3xl font-bold">{pageData.heading}</h1>
// //         </div>
// //       </header>

// //       <main className="container mx-auto px-4 py-12">
// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5 }}
// //           className="mb-16"
// //         >
// //           <Card className="overflow-hidden">
// //             <CardContent className="p-0">
// //               <div className="grid md:grid-cols-2 gap-8">
// //                 <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
// //                   <h2 className="text-3xl font-bold mb-6">About Our Service</h2>
// //                   <p className="mb-8 text-lg">{pageData.bodyText}</p>
// //                   <ul className="space-y-4">
// //                     {pageData.features.map((feature: string, index: number) => (
// //                       <li key={index} className="flex items-center">
// //                         <Check className="h-6 w-6 mr-2 text-green-400" />
// //                         <span>{feature}</span>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //                 <div className="p-8 flex flex-col justify-center">
// //                   <h3 className="text-2xl font-semibold mb-6 text-blue-600">Get Started Now</h3>
// //                   <Select value={selectedCountry} onValueChange={setSelectedCountry}>
// //                     <SelectTrigger className="w-full mb-4">
// //                       <SelectValue placeholder="Select a country" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {countries.map((country) => (
// //                         <SelectItem key={country.value} value={country.value}>
// //                           {country.label}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                   <Button
// //                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
// //                     onClick={handleBuyNumber}
// //                     disabled={!selectedCountry}
// //                   >
// //                     {selectedCountry
// //                       ? `Buy Number for ${countries.find(c => c.value === selectedCountry)?.label}`
// //                       : pageData.ctaText}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </motion.section>

// //         <motion.section
// //           initial={{ opacity: 0, y: 20 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.5, delay: 0.2 }}
// //           className="mb-12"
// //         >
// //           <h2 className="text-3xl font-bold mb-8 text-blue-600">Frequently Asked Questions</h2>
// //           <div className="space-y-4">
// //             {pageData.faqs.map((faq: any, index: number) => (
// //               <Card key={index} className="overflow-hidden">
// //                 <CardContent className="p-0">
// //                   <button
// //                     onClick={() => setOpenFaq(openFaq === index ? null : index)}
// //                     className="flex justify-between items-center w-full p-4 text-left"
// //                   >
// //                     <span className="font-medium">{faq.question}</span>
// //                     {openFaq === index ? (
// //                       <ChevronUp className="h-5 w-5 text-blue-600" />
// //                     ) : (
// //                       <ChevronDown className="h-5 w-5 text-blue-600" />
// //                     )}
// //                   </button>
// //                   {openFaq === index && (
// //                     <div className="p-4 bg-blue-50">
// //                       <p>{faq.answer}</p>
// //                     </div>
// //                   )}
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //         </motion.section>
// //       </main>
// //     </div>
// //   );
// // }
// export default function InternalPage() {
//   const { slug } = useParams();
//   interface PageData {
//     heading: string;
//     bodyText: string;
//     features: string[];
//     ctaText: string;
//     faqs: { question: string; answer: string }[];
//   }

//   const [pageData, setPageData] = useState<PageData | null>(null); // State for page data
//   const [loading, setLoading] = useState(true); // Loading state
//   const [openFaq, setOpenFaq] = useState<number | null>(null);
//   const [selectedCountry, setSelectedCountry] = useState<string>('');

//   // Fetch the page data from Firestore
//   useEffect(() => {
//     const fetchPageData = async () => {
//       try {
//         if (!slug) {
//           throw new Error('Slug is undefined');
//         }
//         const pageRef = doc(db, 'internal_pages', slug);
//         const pageSnapshot = await getDoc(pageRef);
//         if (pageSnapshot.exists()) {
//           const data = pageSnapshot.data();
//           const content = data.pageContent?.en || {}; 
//           setPageData(content); // Assuming the data for English is under the 'en' key
//         } else {
//           console.error('No such page!');
//         }
//       } catch (error) {
//         console.error('Error fetching page data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       fetchPageData();
//     }
//   }, [slug]);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (!pageData) {
//     return <p>Page not found</p>;
//   }

//   const handleBuyNumber = () => {
//     if (selectedCountry) {
//       console.log(`Buying number for Google verification in ${selectedCountry}`);
//       // Here you would typically redirect to a checkout page or open a modal
//     } else {
//       alert('Please select a country first');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <header className="bg-blue-600 text-white py-6">
//         <div className="container mx-auto px-4">
//           <h1 className="text-3xl font-bold">{pageData?.heading || 'Heading not available'}</h1>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-12">
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-16"
//         >
//           <Card className="overflow-hidden">
//             <CardContent className="p-0">
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
//                   <h2 className="text-3xl font-bold mb-6">About Our Service</h2>
//                   <p className="mb-8 text-lg">{pageData?.bodyText || 'Description not available'}</p>
//                   <ul className="space-y-4">
//                     {pageData?.features?.length ? (
//                       pageData.features.map((feature: string, index: number) => (
//                         <li key={index} className="flex items-center">
//                           <Check className="h-6 w-6 mr-2 text-green-400" />
//                           <span>{feature}</span>
//                         </li>
//                       ))
//                     ) : (
//                       <li>No features available</li>
//                     )}
//                   </ul>
//                 </div>
//                 <div className="p-8 flex flex-col justify-center">
//                   <h3 className="text-2xl font-semibold mb-6 text-blue-600">Get Started Now</h3>
//                   <Select value={selectedCountry} onValueChange={setSelectedCountry}>
//                     <SelectTrigger className="w-full mb-4">
//                       <SelectValue placeholder="Select a country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((country: { value: string; label: string }) => (
//                         <SelectItem key={country.value} value={country.value}>
//                           {country.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Button
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
//                     onClick={handleBuyNumber}
//                     disabled={!selectedCountry}
//                   >
//                     {selectedCountry
//                       ? `Buy Number for ${countries.find((c: { value: string; label: string }) => c.value === selectedCountry)?.label}`
//                       : pageData?.ctaText || 'Buy Number'}
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.section>

//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mb-12"
//         >
//           <h2 className="text-3xl font-bold mb-8 text-blue-600">Frequently Asked Questions</h2>
//           <div className="space-y-4">
//             {pageData?.faqs?.length ? (
//               pageData.faqs.map((faq: any, index: number) => (
//                 <Card key={index} className="overflow-hidden">
//                   <CardContent className="p-0">
//                     <button
//                       onClick={() => setOpenFaq(openFaq === index ? null : index)}
//                       className="flex justify-between items-center w-full p-4 text-left"
//                     >
//                       <span className="font-medium">{faq.question}</span>
//                       {openFaq === index ? (
//                         <ChevronUp className="h-5 w-5 text-blue-600" />
//                       ) : (
//                         <ChevronDown className="h-5 w-5 text-blue-600" />
//                       )}
//                     </button>
//                     {openFaq === index && (
//                       <div className="p-4 bg-blue-50">
//                         <p>{faq.answer}</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               ))
//             ) : (
//               <p>No FAQs available</p>
//             )}
//           </div>
//         </motion.section>
//       </main>
//     </div>
//   );
// }

// 'use client'

///uuuuuuuuuuuuuuu


//ppp
// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { ChevronDown, ShoppingCart, Check, Globe } from 'lucide-react'
// import { Button } from './ui/button'
// import { Card, CardContent } from './ui/card'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
// import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
// import { db } from './../../firebase/config'
// import { useTranslation } from 'react-i18next'
// import axios from 'axios'
// import { useToast } from './ui/use-toast'
// import { ToastAction } from './ui/toast'
// import { useAuth } from '../../contexts/authcontext'

// interface PageData {
//   heading: string
//   bodyText: string
//   features: string[]
//   ctaText: string
//   faqs: { question: string; answer: string }[]
//   service: string
// }

// interface Country {
//   name: string
//   value: string
// }

// export default function InternalPage() {
//   const { slug } = useParams<{ slug: string }>()
//   const { t, i18n } = useTranslation()
//   const navigate = useNavigate()
//   const { toast } = useToast()
//   const [pageData, setPageData] = useState<PageData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [countries, setCountries] = useState<Country[]>([])
//   const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
//   const [buying, setBuying] = useState(false)
//   const [failedToBuy, setFailedToBuy] = useState(false)
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     const fetchPageData = async () => {
//       try {
//         if (!slug) {
//           throw new Error('Slug is undefined')
//         }
//         const pageRef = doc(db, 'internal_pages', slug)
//         const pageSnapshot = await getDoc(pageRef)
//         if (pageSnapshot.exists()) {
//           const data = pageSnapshot.data()
//           const content = {
//             ...data.pageContent?.[i18n.language],
//             service: data.service || ''
//           }
//           setPageData(content)
//         } else {
//           console.error('No such page!')
//         }
//       } catch (error) {
//         console.error('Error fetching page data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const fetchCountries = async () => {
//       try {
//         const countriesQuery = query(collection(db, 'countries'), where('included', '==', true))
//         const countriesSnapshot = await getDocs(countriesQuery)
//         const countriesData = countriesSnapshot.docs.map(doc => ({
//           name: doc.data().name,
//           value: doc.id
//         }))
//         setCountries(countriesData)
//       } catch (error) {
//         console.error('Error fetching countries:', error)
//       }
//     }

//     if (slug) {
//       fetchPageData()
//       fetchCountries()
//     }
//   }, [slug, i18n.language])

//   const buyProduct = async () => {
//     setBuying(true)
//     setFailedToBuy(false)
//     console.log('buying product')
//     const country = selectedCountry?.name.toLowerCase()
//     const product = pageData?.service.toLowerCase()

//     console.log('buying product', country, product)

//     try {
//       const response = await axios.post(
//         'https://smsverify-server.vercel.app/api/buy-product',
//         {
//           uid: currentUser?.uid, // Replace with actual user ID
//           country,
//           product,
//         },
//       )

//       const id = response.data?.product?.id ?? null

//       // Reset the selected states
//       setSelectedCountry(null)

//       // Success toast notification
//       toast({
//         variant: 'success',
//         title: t('productPurchasedSuccessfully'),
//         description: t('youCanNowUseTheService'),
//       })
//       navigate(`/sms?id=${id}`)
//       setBuying(false)
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: 'destructive',
//             title: t('insufficientBalance'),
//             description: t('pleaseTopUpYourAccount'),
//             action: (
//               <ToastAction
//                 onClick={() => navigate('/pay')}
//                 altText={t('goToPayment')}
//               >
//                 {t('goToPayment')}
//               </ToastAction>
//             ),
//           })
//         } else {
//           toast({
//             variant: 'destructive',
//             title: t('purchaseFailed'),
//             description: t('somethingWentWrong'),
//           })
//           setFailedToBuy(true)
//           setBuying(false)
//         }
//       } else {
//         setFailedToBuy(true)
//         setBuying(false)
//         toast({
//           variant: 'destructive',
//           title: t('unknownError'),
//           description: t('unknownErrorOccurred'),
//           action: (
//             <ToastAction onClick={buyProduct} altText={t('tryAgain')}>
//               {t('tryAgain')}
//             </ToastAction>
//           ),
//         })
//       }
//       setFailedToBuy(true)
//       setBuying(false)
//       console.error('Error purchasing product:', error)
//     }
//   }

//   const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
//     const [isOpen, setIsOpen] = useState(false)

//     return (
//       <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
//         <button
//           className="flex justify-between items-center w-full p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           <span className="text-lg font-semibold text-gray-800">{question}</span>
//           <motion.div
//             animate={{ rotate: isOpen ? 180 : 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <ChevronDown className="w-5 h-5 text-gray-600" />
//           </motion.div>
//         </button>
//         <AnimatePresence initial={false}>
//           {isOpen && (
//             <motion.div
//               initial={{ height: 0, opacity: 0 }}
//               animate={{ height: 'auto', opacity: 1 }}
//               exit={{ height: 0, opacity: 0 }}
//               transition={{ duration: 0.3, ease: 'easeInOut' }}
//             >
//               <div className="p-4 bg-white text-gray-700 text-lg leading-relaxed">
//                 {answer}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     )
//   }

//   if (loading) {
//     return <p className="text-center py-8">{t('loading')}</p>
//   }

//   if (!pageData) {
//     return <p className="text-center py-8">{t('pageNotFound')}</p>
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
//       <header className="py-8 text-center bg-white shadow-sm">
//         <h1 className="text-4xl font-bold text-gray-900 px-4">{pageData.heading || t('headingNotAvailable')}</h1>
//       </header>

//       <main className="container mx-auto px-4 py-12">
//         <Card className="overflow-hidden mb-12 shadow-lg">
//           <CardContent className="p-0">
//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="p-8">
//                 <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('aboutOurService')}</h2>
//                 <p className="mb-8 text-lg text-gray-700 leading-relaxed">{pageData.bodyText || t('descriptionNotAvailable')}</p>
//                 <ul className="space-y-4 mb-8">
//                   {pageData.features?.length ? (
//                     pageData.features.map((feature, index) => (
//                       <li key={index} className="flex items-center text-gray-700">
//                         <Check className="h-6 w-6 mr-2 text-green-500" />
//                         <span>{feature}</span>
//                       </li>
//                     ))
//                   ) : (
//                     <li>{t('noFeaturesAvailable')}</li>
//                   )}
//                 </ul>
//                 <div className="mt-8">
//                   <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('getStartedNow')}</h3>
//                   <Select value={selectedCountry?.value} onValueChange={(value: string) => setSelectedCountry(countries.find(c => c.value === value) || null)}>
//                     <SelectTrigger className="w-full mb-4">
//                       <SelectValue placeholder={t('selectCountry')} />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((country) => (
//                         <SelectItem key={country.value} value={country.value}>
//                           {country.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Button
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 transition-colors duration-200 shadow-md hover:shadow-lg"
//                     onClick={buyProduct}
//                     disabled={!selectedCountry || buying}
//                   >
//                     {buying ? (
//                       t('processing')
//                     ) : selectedCountry ? (
//                       <>
//                         <ShoppingCart className="mr-2 h-5 w-5" />
//                         {t('buyServiceForCountry', { service: pageData.service, country: selectedCountry.name })}
//                       </>
//                     ) : (
//                       pageData.ctaText || t('buyNumber')
//                     )}
//                   </Button>
//                   {failedToBuy && (
//                     <p className="mt-2 text-red-500">{t('failedToBuy')}</p>
//                   )}
//                 </div>
//               </div>
//               <div className="p-8 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col justify-center items-center">
//                 <Globe className="w-16 h-16 text-blue-600 mb-4" />
//                 <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('availableService')}</h3>
//                 <div className="text-3xl font-bold text-blue-700 mb-4">{pageData.service}</div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <section className="mb-12">
//           <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{t('frequentlyAskedQuestions')}</h2>
//           <div className="space-y-4 max-w-3xl mx-auto">
//             {pageData.faqs?.length ? (
//               pageData.faqs.map((faq, index) => (
//                 <FAQItem key={index} question={faq.question} answer={faq.answer} />
//               ))
//             ) : (
//               <p className="text-gray-700 text-center">{t('noFaqsAvailable')}</p>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }
//last one
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ShoppingCart, Check, Globe } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './../../firebase/config'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { useToast } from './ui/use-toast'
import { ToastAction } from './ui/toast'
import { useAuth } from '../../contexts/authcontext'

interface PageData {
  heading: string
  bodyText: string
  features: string[]
  ctaText: string
  faqs: { question: string; answer: string }[]
  service: string
}

interface Country {
  name: string
  value: string
}

export default function InternalPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [buying, setBuying] = useState(false)
  const [failedToBuy, setFailedToBuy] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (!slug) {
          throw new Error('Slug is undefined')
        }
        const pageRef = doc(db, 'internal_pages', slug)
        const pageSnapshot = await getDoc(pageRef)
        if (pageSnapshot.exists()) {
          const data = pageSnapshot.data()
          const content = {
            ...data.pageContent?.[i18n.language],
            service: data.service || ''
          }
          setPageData(content)
        } else {
          console.error('No such page!')
        }
      } catch (error) {
        console.error('Error fetching page data:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchCountries = async () => {
      try {
        const countriesQuery = query(collection(db, 'countries'), where('included', '==', true))
        const countriesSnapshot = await getDocs(countriesQuery)
        const countriesData = countriesSnapshot.docs.map(doc => ({
          name: doc.data().name,
          value: doc.id
        }))
        setCountries(countriesData)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    if (slug) {
      fetchPageData()
      fetchCountries()
    }
  }, [slug, i18n.language])

  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedCountry && pageData) {
        const pricingKey = `${selectedCountry.name.toLowerCase()}_${pageData.service.toLowerCase()}`
        try {
          // Try to fetch from pricing collection
          const pricingRef = doc(db, 'pricing', pricingKey)
          const pricingSnapshot = await getDoc(pricingRef)
          
          if (pricingSnapshot.exists()) {
            setPrice(pricingSnapshot.data().price)
          } else {
            // If not found, fetch from services collection
            const serviceRef = doc(db, 'services', pageData.service.toLowerCase())
            const serviceSnapshot = await getDoc(serviceRef)
            
            if (serviceSnapshot.exists()) {
              setPrice(serviceSnapshot.data().price)
            } else {
              setPrice(null)
            }
          }
        } catch (error) {
          console.error('Error fetching price:', error)
          setPrice(null)
        }
      }
    }

    fetchPrice()
  }, [selectedCountry, pageData])

  const buyProduct = async () => {
    setBuying(true)
    setFailedToBuy(false)
    console.log('buying product')
    const country = selectedCountry?.name.toLowerCase()
    const product = pageData?.service.toLowerCase()

    console.log('buying product', country, product)

    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/buy-product',
        {
          uid: currentUser?.uid, // Replace with actual user ID
          country,
          product,
        },
      )

      const id = response.data?.product?.id ?? null

      // Reset the selected states
      setSelectedCountry(null)
      setPrice(null)

      // Success toast notification
      toast({
        variant: 'success',
        title: t('productPurchasedSuccessfully'),
        description: t('youCanNowUseTheService'),
      })
      navigate(`/sms?id=${id}`)
      setBuying(false)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: t('insufficientBalance'),
            description: t('pleaseTopUpYourAccount'),
            action: (
              <ToastAction
                onClick={() => navigate('/pay')}
                altText={t('goToPayment')}
              >
                {t('goToPayment')}
              </ToastAction>
            ),
          })
        } else {
          toast({
            variant: 'destructive',
            title: t('purchaseFailed'),
            description: t('somethingWentWrong'),
          })
          setFailedToBuy(true)
          setBuying(false)
        }
      } else {
        setFailedToBuy(true)
        setBuying(false)
        toast({
          variant: 'destructive',
          title: t('unknownError'),
          description: t('unknownErrorOccurred'),
          action: (
            <ToastAction onClick={buyProduct} altText={t('tryAgain')}>
              {t('tryAgain')}
            </ToastAction>
          ),
        })
      }
      setFailedToBuy(true)
      setBuying(false)
      console.error('Error purchasing product:', error)
    }
  }

  const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          className="flex justify-between items-center w-full p-4 text-left bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg font-semibold text-gray-800">{question}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-600" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="p-4 bg-white text-gray-700 text-lg leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (loading) {
    return <p className="text-center py-8">{t('loading')}</p>
  }

  if (!pageData) {
    navigate('/404');
    return <p className="text-center py-8">{t('pageNotFound')}</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="py-8 text-center bg-white shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 px-4">{pageData.heading || t('headingNotAvailable')}</h1>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden mb-12 shadow-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('aboutOurService')}</h2>
                <p className="mb-8 text-lg text-gray-700 leading-relaxed">{pageData.bodyText || t('descriptionNotAvailable')}</p>
                <ul className="space-y-4 mb-8">
                  {pageData.features?.length ? (
                    pageData.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-6 w-6 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li>{t('noFeaturesAvailable')}</li>
                  )}
                </ul>
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('getStartedNow')}</h3>
                  <Select value={selectedCountry?.value} onValueChange={(value: string) => setSelectedCountry(countries.find(c => c.value === value) || null)}>
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder={t('selectCountry')} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={buyProduct}
                    disabled={!selectedCountry || buying}
                  >
                    {buying ? (
                      t('processing')
                    ) : selectedCountry ? (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t('buyService', { service: pageData.service })} - {price ? `$${price.toFixed(2)}` : t('priceUnavailable')}
                      </>
                    ) : (
                      pageData.ctaText || t('buyNumber')
                    )}
                  </Button>
                  {failedToBuy && (
                    <p className="mt-2 text-red-500">{t('failedToBuy')}</p>
                  )}
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-100 to-indigo-100 flex flex-col justify-center items-center">
                <Globe className="w-16 h-16 text-blue-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('availableService')}</h3>
                <div className="text-3xl font-bold text-blue-700 mb-4">{pageData.service}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{t('frequentlyAskedQuestions')}</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {pageData.faqs?.length ? (
              pageData.faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))
            ) : (
              <p className="text-gray-700 text-center">{t('noFaqsAvailable')}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}