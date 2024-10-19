// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { Badge } from "./ui/badge"
// import { Search, ArrowRight } from "lucide-react"
// import { Link } from 'react-router-dom'

// // Mock data for internal pages
// const internalPages = [
//   { id: 1, slug: 'buy-number-for-google', title: 'Buy Number for Google', description: 'Get a virtual phone number for Google verification.', tags: ['Google', 'Phone Number'] },
//   { id: 2, slug: 'sms-verification-service', title: 'SMS Verification Service', description: 'Reliable SMS verification for various platforms.', tags: ['SMS', 'Verification'] },
//   { id: 3, slug: 'virtual-phone-numbers', title: 'Virtual Phone Numbers', description: 'Get virtual phone numbers for multiple countries.', tags: ['Virtual', 'International'] },
//   { id: 4, slug: 'temporary-phone-numbers', title: 'Temporary Phone Numbers', description: 'Short-term phone numbers for quick verifications.', tags: ['Temporary', 'Quick'] },
//   { id: 5, slug: 'bulk-sms-verification', title: 'Bulk SMS Verification', description: 'Verify multiple accounts simultaneously.', tags: ['Bulk', 'Business'] },
//   { id: 6, slug: 'phone-number-rental', title: 'Phone Number Rental', description: 'Rent phone numbers for extended periods.', tags: ['Rental', 'Long-term'] },
// ]

// export default function InternalPagesShowcase() {
//   const [searchTerm, setSearchTerm] = useState('')

//   const filteredPages = internalPages.filter(page =>
//     page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     page.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
//   )

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <motion.h1
//         className="text-4xl font-bold mb-8 text-center text-primary"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         Our Services
//       </motion.h1>
//       <motion.div
//         className="relative mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//         <Input
//           type="text"
//           placeholder="Search services..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10 pr-4 py-2 w-full bg-background border-primary"
//         />
//       </motion.div>
//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//       >
//         {filteredPages.map((page, index) => (
//           <motion.div
//             key={page.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//           >
//             <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
//               <CardHeader>
//                 <CardTitle className="text-primary">{page.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">{page.description}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {page.tags.map((tag, index) => (
//                     <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">{tag}</Badge>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter className="mt-auto">
//                 <Link to={`/${page.slug}`} className="w-full">
//                   <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                     Learn More
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>
//       {filteredPages.length === 0 && (
//         <motion.p
//           className="text-center text-muted-foreground mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           No services found matching your search.
//         </motion.p>
//       )}
//     </div>
//   )
// }
//234567890

//hhhhhh
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from './ui/card';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import { Badge } from './ui/badge';
// import { Search, ArrowRight } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase/config'; // Ensure the path is correct to your Firebase config

// export default function InternalPagesShowcase() {
//   const [pages, setPages] = useState<Page[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredPages, setFilteredPages] = useState<Page[]>([]);

//   type Page = {
//     id: string;
//     slug: string;
//     title: string;
//     description: string;
//     tags: string[];
//   };

//   // Fetch pages from Firestore
//   useEffect(() => {
//     const fetchPages = async () => {
//       try {
//         const pagesCollection = collection(db, 'internal_pages');
//         const pagesSnapshot = await getDocs(pagesCollection);

//         const pagesList = pagesSnapshot.docs.map((doc) => {
//           const data = doc.data();

//           // Access the 'en' content or provide defaults if not available
//           const content = data.en || {};

//           return {
//             id: doc.id,                   // Document ID as fallback for slug
//             slug: doc.id,                 // Assuming slug should be the document ID
//             title: content.heading || '',   // Safely access the title
//             description: content.bodyText || '', // Safely access description
//             tags: content.tags || [],     // Ensure tags is an array, or fallback to an empty array
//           };
//         });

//         setPages(pagesList); // Set the fetched pages to the state
//         console.log('Pages:', pagesList); // Debugging output
//       } catch (error) {
//         console.error('Error fetching pages:', error);
//       }
//     };
//     // console.log('Pages:', pages,pagesList); // Debugging output

//     fetchPages();
//   }, []);

//   // Filter pages based on search term and when pages data changes
//   useEffect(() => {
//     const filtered = pages.filter(
//       (page: Page) =>
//         (page.title &&
//           page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (page.description &&
//           page.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (page.tags &&
//           page.tags.some((tag) =>
//             tag.toLowerCase().includes(searchTerm.toLowerCase())
//           ))
//     );
//     setFilteredPages(pages);
//     console.log('Filtered Pages:', filtered,pages);
//   }, [searchTerm, pages]); // Run this effect when searchTerm or pages changes

//   return (
//     <div className="container mx-auto p-4 max-w-6xl">
//       <motion.h1
//         className="text-4xl font-bold mb-8 text-center text-primary"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         Our Services
//       </motion.h1>
//       <motion.div
//         className="relative mb-8"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//         <Input
//           type="text"
//           placeholder="Search services..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10 pr-4 py-2 w-full bg-background border-primary"
//         />
//       </motion.div>
//       <motion.div
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.4 }}
//       >
//         {filteredPages.map((page, index) => (
//           <motion.div
//             key={page.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//           >
//             <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
//               <CardHeader>
//                 <CardTitle className="text-primary">{page.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">{page.description}</p>
//                 <div className="flex flex-wrap gap-2">
//                   {page.tags.map((tag: string, index: number) => (
//                     <Badge
//                       key={index}
//                       variant="secondary"
//                       className="bg-primary/10 text-primary"
//                     >
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter className="mt-auto">
//                 <Link to={`/${page.slug}`} className="w-full">
//                   <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
//                     Learn More
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </Link>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         ))}
//       </motion.div>
//       {filteredPages.length === 0 && (
//         <motion.p
//           className="text-center text-muted-foreground mt-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           No services found matching your search.
//         </motion.p>
//       )}
//     </div>
//   );
// }
// internal pages
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config'; // Ensure the path is correct to your Firebase config

export default function InternalPagesShowcase() {
  const [pages, setPages] = useState<Page[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);

  type Page = {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
  };

  
 useEffect(() => {
  const fetchPages = async () => {
    try {
      const pagesCollection = collection(db, 'internal_pages');
      const pagesSnapshot = await getDocs(pagesCollection);

      const pagesList = pagesSnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log('Document Data:', data); // Log the entire document
        console.log('Keys in Document Data:', Object.keys(data)); // Log the keys

        const content = data.pageContent.en || {};
        console.log('Content:', content,data); // Log the content for debugging

        const title = content.heading || 'Untitled';
        const description = content.bodyText || 'No description available.';
        const tags = Array.isArray(content.tags) ? content.tags : []; // Ensure tags is an array
        console.log(`Title: ${title}, Description: ${description}, Tags: ${tags}`);

        return {
          id: doc.id,
          slug: doc.id,
          title: title,
          description: description,
          tags: tags,
        };
      });

      setPages(pagesList); // Set the fetched pages to the state
      console.log('Pages:', pagesList); // Debugging output
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  fetchPages();
}, []);


  // Filter pages based on search term and when pages data changes
  useEffect(() => {
    const filtered = pages.filter(
      (page: Page) =>
        (page.title &&
          page.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (page.description &&
          page.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (page.tags &&
          page.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );
    setFilteredPages(filtered); // Use the filtered result here
    console.log('Filtered Pages:', filtered);
  }, [searchTerm, pages]); // Run this effect when searchTerm or pages changes

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center text-primary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Our Services
      </motion.h1>
      <motion.div
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full bg-background border-primary"
        />
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {filteredPages.map((page, index) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-primary">{page.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{page.description}</p>
                <div className="flex flex-wrap gap-2">
                  {page.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Link to={`/services/${page.slug}`} className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      {filteredPages.length === 0 && (
        <motion.p
          className="text-center text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No services found matching your search.
        </motion.p>
      )}
    </div>
  );
}
