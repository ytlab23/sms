

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../firebase/config'; // Ensure you import your Firestore config

const countries: { value: string; label: string }[] = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
];

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
//           setPageData(data.en); // Assuming the data for English is under the 'en' key
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
//           <h1 className="text-3xl font-bold">{pageData.heading}</h1>
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
//                   <p className="mb-8 text-lg">{pageData.bodyText}</p>
//                   <ul className="space-y-4">
//                     {pageData.features.map((feature: string, index: number) => (
//                       <li key={index} className="flex items-center">
//                         <Check className="h-6 w-6 mr-2 text-green-400" />
//                         <span>{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//                 <div className="p-8 flex flex-col justify-center">
//                   <h3 className="text-2xl font-semibold mb-6 text-blue-600">Get Started Now</h3>
//                   <Select value={selectedCountry} onValueChange={setSelectedCountry}>
//                     <SelectTrigger className="w-full mb-4">
//                       <SelectValue placeholder="Select a country" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {countries.map((country) => (
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
//                       ? `Buy Number for ${countries.find(c => c.value === selectedCountry)?.label}`
//                       : pageData.ctaText}
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
//             {pageData.faqs.map((faq: any, index: number) => (
//               <Card key={index} className="overflow-hidden">
//                 <CardContent className="p-0">
//                   <button
//                     onClick={() => setOpenFaq(openFaq === index ? null : index)}
//                     className="flex justify-between items-center w-full p-4 text-left"
//                   >
//                     <span className="font-medium">{faq.question}</span>
//                     {openFaq === index ? (
//                       <ChevronUp className="h-5 w-5 text-blue-600" />
//                     ) : (
//                       <ChevronDown className="h-5 w-5 text-blue-600" />
//                     )}
//                   </button>
//                   {openFaq === index && (
//                     <div className="p-4 bg-blue-50">
//                       <p>{faq.answer}</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </motion.section>
//       </main>
//     </div>
//   );
// }
export default function InternalPage() {
  const { slug } = useParams();
  interface PageData {
    heading: string;
    bodyText: string;
    features: string[];
    ctaText: string;
    faqs: { question: string; answer: string }[];
  }

  const [pageData, setPageData] = useState<PageData | null>(null); // State for page data
  const [loading, setLoading] = useState(true); // Loading state
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Fetch the page data from Firestore
  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (!slug) {
          throw new Error('Slug is undefined');
        }
        const pageRef = doc(db, 'internal_pages', slug);
        const pageSnapshot = await getDoc(pageRef);
        if (pageSnapshot.exists()) {
          const data = pageSnapshot.data();
          const content = data.pageContent?.en || {}; 
          setPageData(content); // Assuming the data for English is under the 'en' key
        } else {
          console.error('No such page!');
        }
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!pageData) {
    return <p>Page not found</p>;
  }

  const handleBuyNumber = () => {
    if (selectedCountry) {
      console.log(`Buying number for Google verification in ${selectedCountry}`);
      // Here you would typically redirect to a checkout page or open a modal
    } else {
      alert('Please select a country first');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{pageData?.heading || 'Heading not available'}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                  <h2 className="text-3xl font-bold mb-6">About Our Service</h2>
                  <p className="mb-8 text-lg">{pageData?.bodyText || 'Description not available'}</p>
                  <ul className="space-y-4">
                    {pageData?.features?.length ? (
                      pageData.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-6 w-6 mr-2 text-green-400" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <li>No features available</li>
                    )}
                  </ul>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-semibold mb-6 text-blue-600">Get Started Now</h3>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country: { value: string; label: string }) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
                    onClick={handleBuyNumber}
                    disabled={!selectedCountry}
                  >
                    {selectedCountry
                      ? `Buy Number for ${countries.find((c: { value: string; label: string }) => c.value === selectedCountry)?.label}`
                      : pageData?.ctaText || 'Buy Number'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-blue-600">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {pageData?.faqs?.length ? (
              pageData.faqs.map((faq: any, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex justify-between items-center w-full p-4 text-left"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {openFaq === index ? (
                        <ChevronUp className="h-5 w-5 text-blue-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                    {openFaq === index && (
                      <div className="p-4 bg-blue-50">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No FAQs available</p>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

