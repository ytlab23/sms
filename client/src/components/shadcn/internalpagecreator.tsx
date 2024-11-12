
// import React, { useEffect, useState, useMemo } from 'react';
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Label } from "./ui/label";
// import { ScrollArea } from "./ui/scrollarea";
// import { useToast } from "./ui/use-toast";
// import { PlusCircle, Trash2, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";
// import { db } from './../../firebase/config'; 
// import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where, DocumentData } from "firebase/firestore"; 
// import { useParams, useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

// interface Language {
//   code: string;
//   name: string;
// }

// const languages: Language[] = [
//   { code: 'en', name: 'English' },
//   { code: 'es', name: 'Spanish' },
//   { code: 'pt', name: 'Portuguese' },
//   { code: 'fr', name: 'French' },
//   { code: 'de', name: 'German' },
//   { code: 'it', name: 'Italian' },
//   { code: 'ru', name: 'Russian' },
//   { code: 'zh', name: 'Chinese' },
//   { code: 'ja', name: 'Japanese' },
//   { code: 'ar', name: 'Arabic' }
// ];

// interface Service {
//   name: string;
//   isIncluded: boolean;
// }

// interface FAQ {
//   question: string;
//   answer: string;
// }

// interface PageContent {
//   slug: string;
//   metaTitle: string;
//   metaDescription: string;
//   heading: string;
//   bodyText: string;
//   ctaText: string;
//   faqs: FAQ[];
// }

// interface PageData {
//   [key: string]: PageContent;
// }

// interface Errors {
//   [key: string]: string[];
// }

// interface LanguageStatus {
//   [key: string]: boolean;
// }

// export default function AdminInternalPageCreator() {
//   const { slug: pageSlug } = useParams<{ slug: string }>();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [originalSlug, setOriginalSlug] = useState<string>('');
//   const [service, setService] = useState<string>('');
//   const [services, setServices] = useState<Service[]>([]);
//   const [pageContent, setPageContent] = useState<PageData>(
//     languages.reduce((acc, lang) => ({
//       ...acc, 
//       [lang.code]: { 
//         slug: '',
//         metaTitle: '',
//         metaDescription: '',
//         heading: '', 
//         bodyText: '', 
//         ctaText: '',
//         faqs: [{ question: '', answer: '' }]
//       }
//     }), {})
//   );
//   const [currentLanguage, setCurrentLanguage] = useState<string>('en');
//   const [errors, setErrors] = useState<Errors>({});
//   const [languageStatus, setLanguageStatus] = useState<LanguageStatus>({});
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handleLanguageChange = (newLanguage: string) => {
//     setCurrentLanguage(newLanguage);
//   };

//   useEffect(() => {
//     const fetchPageData = async () => {
//       if (pageSlug) {
//         setIsLoading(true);
//         try {
//           const docRef = doc(db, "internal_pages", pageSlug);
//           const docSnap = await getDoc(docRef);
  
//           if (docSnap.exists()) {
//             const data = docSnap.data() as DocumentData;
//             setOriginalSlug(pageSlug);
//             setService(data.service || '');
  
//             if (data.pageContent) {
//               setPageContent(data.pageContent as PageData);
//             }
//           } else {
//             toast({
//               title: "Page not found",
//               description: "The requested page does not exist.",
//               variant: "destructive",
//             });
//             navigate('/admin/pages');
//           }
//         } catch (error) {
//           toast({
//             title: "Error",
//             description: "Failed to fetch page data. Please try again.",
//             variant: "destructive",
//           });
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchPageData();
//   }, [pageSlug, navigate, toast]);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const servicesQuery = query(collection(db, 'services'), where('isIncluded', '==', true));
//         const servicesSnapshot = await getDocs(servicesQuery);
//         const servicesData = servicesSnapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             name: data.name,
//             isIncluded: data.isIncluded,
//           } as Service;
//         });
//         setServices(servicesData);
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to fetch services. Please try again.",
//           variant: "destructive",
//         });
//       }
//     };

//     fetchServices();
//   }, [toast]);

//   useEffect(() => {
//     validateForm();
//   }, [pageContent, service]);

//   const addFaq = () => {
//     setPageContent((prevContent: PageData) => {
//       const updatedContent: PageData = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang.code] = {
//           ...prevContent[lang.code],
//           faqs: [...prevContent[lang.code].faqs, { question: '', answer: '' }]
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const removeFaq = (index: number) => {
//     setPageContent((prevContent: PageData) => {
//       const updatedContent: PageData = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang.code] = {
//           ...prevContent[lang.code],
//           faqs: prevContent[lang.code].faqs.filter((_, i: number) => i !== index)
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: PageData) => {
//       const faqs = [...prevContent[currentLanguage].faqs];
//       faqs[index].question = question;
//       return {
//         ...prevContent,
//         [currentLanguage]: {
//           ...prevContent[currentLanguage],
//           faqs
//         }
//       };
//     });
//   };

//   const updateFaqAnswer = (index: number, answer: string) => {
//     setPageContent((prevContent: PageData) => {
//       const faqs = [...prevContent[currentLanguage].faqs];
//       faqs[index].answer = answer;
//       return {
//         ...prevContent,
//         [currentLanguage]: {
//           ...prevContent[currentLanguage],
//           faqs
//         }
//       };
//     });
//   };

//   const updatePageContentField = (field: keyof PageContent, value: string) => {
//     setPageContent((prevContent: PageData) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: Errors = {};
//     const newLanguageStatus: LanguageStatus = {};

//     if (!service) newErrors.general = ["Service is required."];

//     languages.forEach((lang) => {
//       const content = pageContent[lang.code];
//       const langErrors: string[] = [];

//       if (!content.slug) langErrors.push(`Slug is required.`);
//       if (!content.metaTitle) langErrors.push(`Meta Title is required.`);
//       if (!content.metaDescription) langErrors.push(`Meta Description is required.`);
//       if (!content.heading) langErrors.push(`Heading is required.`);
//       if (!content.bodyText) langErrors.push(`Body Text is required.`);
//       if (!content.ctaText) langErrors.push(`CTA Text is required.`);

//       if (content.faqs.some((faq: FAQ) => !faq.question || !faq.answer)) {
//         langErrors.push(`All FAQ questions and answers must be filled in.`);
//       }

//       if (langErrors.length > 0) {
//         newErrors[lang.code] = langErrors;
//         newLanguageStatus[lang.code] = false;
//       } else {
//         newLanguageStatus[lang.code] = true;
//       }
//     });

//     setErrors(newErrors);
//     setLanguageStatus(newLanguageStatus);
//     return Object.keys(newErrors).length === 0;
//   };

//   const checkSlugExists = async (slug: string): Promise<boolean> => {
//     const querySnapshot = await getDocs(collection(db, "internal_pages"));
//     return querySnapshot.docs.some(doc => {
//       const data = doc.data();
//       return Object.values(data.pageContent).some((content) => (content as PageContent).slug === slug);
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsLoading(true);

//     try {
//       for (const lang of languages) {
//         const content = pageContent[lang.code];
//         if (content.slug !== originalSlug) {
//           const slugExists = await checkSlugExists(content.slug);
//           if (slugExists) {
//             toast({
//               title: "Slug Already Exists",
//               description: `A page with the slug "${content.slug}" already exists for ${lang.name}. Please choose a different slug.`,
//               variant: "destructive",
//             });
//             setIsLoading(false);
//             return;
//           }
//         }
//       }

//       if (originalSlug) {
//         await deleteDoc(doc(db, "internal_pages", originalSlug));
//       }

//       const docRef = doc(collection(db, "internal_pages"), pageContent.en.slug);
//       const pageData = {
//         service,
//         pageContent,
//       };

//       await setDoc(docRef, pageData, { merge: true });
      
//       toast({
//         title: "Success",
//         description: "Page saved successfully!",
//       });

//       setOriginalSlug(pageContent.en.slug);

//       if (!pageSlug) {
//         navigate(`/admin/pages/edit/${pageContent.en.slug}`);
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to save the page. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const quillModules = useMemo(() => ({
//     toolbar: [
//       [{ 'header': [1, 2, 3, false] }],
//       ['bold', 'italic', 'underline', 'strike'],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       ['link', 'image'],
//       ['clean']
//     ],
//   }), []);

//   const quillFormats = [
//     'header',
//     'bold', 'italic', 'underline', 'strike',
//     'list', 'bullet',
//     'link', 'image'
//   ];

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">
//         {pageSlug ? 'Update Internal Page' : 'Create Internal Page'}
//       </h1>
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
//           <div>
//             <Label htmlFor="language-select">Language</Label>
//             <Select value={currentLanguage} onValueChange={handleLanguageChange}>
//               <SelectTrigger id="language-select">
//                 <Globe className="h-4 w-4 mr-2" />
//                 <SelectValue placeholder="Select Language" />
//               </SelectTrigger>
//               <SelectContent>
//                 {languages.map((lang) => (
//                   <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="slug">Slug</Label>
//             <Input
//               id="slug"
//               placeholder="e.g., buy-number-for-google"
//               value={pageContent[currentLanguage].slug}
//               onChange={(e) => updatePageContentField('slug', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-title">Meta Title</Label>
//             <Input
//               id="meta-title"
//               placeholder="Meta Title"
//               value={pageContent[currentLanguage].metaTitle}
//               onChange={(e) => updatePageContentField('metaTitle', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-description">Meta Description</Label>
//             <Textarea
//               id="meta-description"
//               placeholder="Meta Description"
//               value={pageContent[currentLanguage].metaDescription}
//               onChange={(e) => updatePageContentField('metaDescription', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
//             />
//           </div>

//           <div>
//             <Label htmlFor="service-select">Service</Label>
//             <Select value={service} onValueChange={setService}>
//               <SelectTrigger id="service-select">
//                 <SelectValue placeholder="Select Service" />
//               </SelectTrigger>
//               <SelectContent>
//                 {services.map((service) => (
//                   <SelectItem key={service.name} value={service.name}>{service.name}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="heading">Heading page</Label>
//             <Input
//               id="heading"
//               placeholder="Heading"
//               value={pageContent[currentLanguage].heading}
//               onChange={(e) => updatePageContentField('heading', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
//             />
//           </div>

//           <div>
//             <Label htmlFor="body-text">Body Text</Label>
//             <ReactQuill
//               theme="snow"
//               value={pageContent[currentLanguage].bodyText}
//               onChange={(content) => updatePageContentField('bodyText', content)}
//               modules={quillModules}
//               formats={quillFormats}
//               className="bg-white"
//             />
//           </div>

//           <div>
//             <Label htmlFor="cta-text">CTA Button Text</Label>
//             <Input
//               id="cta-text"
//               placeholder="CTA Button Text"
//               value={pageContent[currentLanguage].ctaText}
//               onChange={(e) => updatePageContentField('ctaText', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
//             />
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold">FAQs</h2>
//               <Button type="button" onClick={addFaq} className="flex items-center">
//                 <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
//               </Button>
//             </div>

//             {pageContent[currentLanguage].faqs.map((faq: FAQ, index: number) => (
//               <Card key={index} className="mb-4">
//                 <CardHeader className="flex justify-between">
//                   <CardTitle className="text-md">FAQ {index + 1}</CardTitle>
//                   <Button type="button" variant="ghost" onClick={() => removeFaq(index)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div>
//                     <Label htmlFor={`faq-question-${index}`}>Question</Label>
//                     <Input
//                       id={`faq-question-${index}`}
//                       placeholder="Question"
//                       value={faq.question}
//                       onChange={(e) => updateFaqQuestion(index, e.target.value)}
//                       className="mb-2"
//                       aria-invalid={!!errors[currentLanguage]}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
//                     <Textarea
//                       id={`faq-answer-${index}`}
//                       placeholder="Answer"
//                       value={faq.answer}
//                       onChange={(e) => updateFaqAnswer(index, e.target.value)}
//                       aria-invalid={!!errors[currentLanguage]}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               'Save Page'
//             )}
//           </Button>
//         </form>

//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Form Validation</h2>
//           {errors.general && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>General Errors</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="list-disc pl-5">
//                   {errors.general.map((error, index) => (
//                     <li key={index} className="text-red-500">{error}</li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           )}
//           {languages.map((lang) => (
//             <Card key={lang.code}>
//               <CardHeader className="flex flex-row items-center space-x-2">
//                 {languageStatus[lang.code] ? (
//                   <CheckCircle className="h-5 w-5 text-green-500" />
//                 ) : (
//                   <XCircle className="h-5 w-5 text-red-500" />
//                 )}
//                 <CardTitle>{lang.name}</CardTitle>
//               </CardHeader>
//               {errors[lang.code] && errors[lang.code].length > 0 && (
//                 <CardContent>
//                   <ScrollArea className="h-[100px] w-full">
//                     <ul className="list-disc pl-5">
//                       {errors[lang.code].map((error, index) => (
//                         <li key={index} className="text-red-500">{error}</li>
//                       ))}
//                     </ul>
//                   </ScrollArea>
//                 </CardContent>
//               )}
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { ScrollArea } from "./ui/scrollarea"
import { useToast } from "./ui/use-toast"
import { PlusCircle, Trash2, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { db } from '../../firebase/config'
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where, DocumentData } from "firebase/firestore"
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface Language {
  code: string
  name: string
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ar', name: 'Arabic' }
]

interface Service {
  name: string
  isIncluded: boolean
}

interface FAQ {
  question: string
  answer: string
}

interface PageContent {
  slug: string
  metaTitle: string
  metaDescription: string
  heading: string
  bodyText: string
  ctaText: string
  faqs: FAQ[]
}

interface PageData {
  [key: string]: PageContent
}

interface Errors {
  [key: string]: string[]
}

interface LanguageStatus {
  [key: string]: boolean
}

export default function AdminInternalPageCreator() {
  const { slug: pageSlug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [originalSlug, setOriginalSlug] = useState<string>('')
  const [service, setService] = useState<string>('')
  const [services, setServices] = useState<Service[]>([])
  const [pageContent, setPageContent] = useState<PageData>(
    languages.reduce((acc, lang) => ({
      ...acc, 
      [lang.code]: { 
        slug: '',
        metaTitle: '',
        metaDescription: '',
        heading: '', 
        bodyText: '', 
        ctaText: '',
        faqs: [{ question: '', answer: '' }]
      }
    }), {})
  )
  const [currentLanguage, setCurrentLanguage] = useState<string>('en')
  const [errors, setErrors] = useState<Errors>({})
  const [languageStatus, setLanguageStatus] = useState<LanguageStatus>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage)
  }

  useEffect(() => {
    const fetchPageData = async () => {
      if (pageSlug) {
        setIsLoading(true)
        try {
          const docRef = doc(db, "internal_pages", pageSlug)
          const docSnap = await getDoc(docRef)
  
          if (docSnap.exists()) {
            const data = docSnap.data() as DocumentData
            setOriginalSlug(pageSlug)
            setService(data.service || '')
  
            if (data.pageContent) {
              setPageContent(data.pageContent as PageData)
            }
          } else {
            toast({
              title: "Page not found",
              description: "The requested page does not exist.",
              variant: "destructive",
            })
            navigate('/admin382013453sms/edit')
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to fetch page data. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchPageData()
  }, [pageSlug, navigate, toast])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesQuery = query(collection(db, 'services'), where('isIncluded', '==', true))
        const servicesSnapshot = await getDocs(servicesQuery)
        const servicesData = servicesSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name,
            isIncluded: data.isIncluded,
          } as Service
        })
        setServices(servicesData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch services. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchServices()
  }, [toast])

  useEffect(() => {
    validateForm()
  }, [pageContent, service])

  const addFaq = () => {
    setPageContent((prevContent: PageData) => {
      const updatedContent: PageData = { ...prevContent }
      languages.forEach((lang) => {
        updatedContent[lang.code] = {
          ...prevContent[lang.code],
          faqs: [...prevContent[lang.code].faqs, { question: '', answer: '' }]
        }
      })
      return updatedContent
    })
  }

  const removeFaq = (index: number) => {
    setPageContent((prevContent: PageData) => {
      const updatedContent: PageData = { ...prevContent }
      languages.forEach((lang) => {
        updatedContent[lang.code] = {
          ...prevContent[lang.code],
          faqs: prevContent[lang.code].faqs.filter((_, i: number) => i !== index)
        }
      })
      return updatedContent
    })
  }

  const updateFaqQuestion = (index: number, question: string) => {
    setPageContent((prevContent: PageData) => {
      const faqs = [...prevContent[currentLanguage].faqs]
      faqs[index].question = question
      return {
        ...prevContent,
        [currentLanguage]: {
          ...prevContent[currentLanguage],
          faqs
        }
      }
    })
  }

  const updateFaqAnswer = (index: number, answer: string) => {
    setPageContent((prevContent: PageData) => {
      const faqs = [...prevContent[currentLanguage].faqs]
      faqs[index].answer = answer
      return {
        ...prevContent,
        [currentLanguage]: {
          ...prevContent[currentLanguage],
          faqs
        }
      }
    })
  }

  const updatePageContentField = (field: keyof PageContent, value: string) => {
    setPageContent((prevContent: PageData) => ({
      ...prevContent,
      [currentLanguage]: {
        ...prevContent[currentLanguage],
        [field]: value
      }
    }))
  }

  const validateForm = () => {
    const newErrors: Errors = {}
    const newLanguageStatus: LanguageStatus = {}

    if (!service) newErrors.general = ["Service is required."]

    languages.forEach((lang) => {
      const content = pageContent[lang.code]
      const langErrors: string[] = []

      if (!content.slug) langErrors.push(`Slug is required.`)
      if (!content.metaTitle) langErrors.push(`Meta Title is required.`)
      if (!content.metaDescription) langErrors.push(`Meta Description is required.`)
      if (!content.heading) langErrors.push(`Heading is required.`)
      if (!content.bodyText) langErrors.push(`Body Text is required.`)
      if (!content.ctaText) langErrors.push(`CTA Text is required.`)

      if (content.faqs.some((faq: FAQ) => !faq.question || !faq.answer)) {
        langErrors.push(`All FAQ questions and answers must be filled in.`)
      }

      if (langErrors.length > 0) {
        newErrors[lang.code] = langErrors
        newLanguageStatus[lang.code] = false
      } else {
        newLanguageStatus[lang.code] = true
      }
    })

    setErrors(newErrors)
    setLanguageStatus(newLanguageStatus)
    return Object.keys(newErrors).length === 0
  }

  const checkSlugExists = async (slug: string, language: string, originalSlug: string): Promise<boolean> => {
    const querySnapshot = await getDocs(collection(db, "internal_pages"))
    return querySnapshot.docs.some(doc => {
      const data = doc.data()
      // Check if the slug exists for any page other than the current one
      return doc.id !== originalSlug && data.pageContent[language]?.slug === slug
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      for (const lang of languages) {
        const content = pageContent[lang.code]
        const slugExists = await checkSlugExists(content.slug, lang.code, originalSlug)
        if (slugExists) {
          toast({
            title: "Slug Already Exists",
            description: `A page with the slug "${content.slug}" already exists for ${lang.name}. Please choose a different slug.`,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      if (originalSlug && originalSlug !== pageContent.en.slug) {
        await deleteDoc(doc(db, "internal_pages", originalSlug))
      }

      const docRef = doc(collection(db, "internal_pages"), pageContent.en.slug)
      const pageData = {
        service,
        pageContent,
      }

      await setDoc(docRef, pageData, { merge: true })
      
      toast({
        title: "Success",
        description: "Page saved successfully!",
      })

      setOriginalSlug(pageContent.en.slug)

      if (!pageSlug) {
        navigate(`/admin382013453sms/edit/${pageContent.en.slug}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the page. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {pageSlug ? 'Update Internal Page' : 'Create Internal Page'}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
        <div>
            <Label htmlFor="service-select">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service-select">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent className="bg-white ">
                {services.map((service) => (
                  <SelectItem className ="hover:text-blue-600" key={service.name} value={service.name}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="language-select">Language</Label>
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="e.g., buy-number-for-google"
              value={pageContent[currentLanguage].slug}
              onChange={(e) => updatePageContentField('slug', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
            />
          </div>

          <div>
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              placeholder="Meta Title"
              value={pageContent[currentLanguage].metaTitle}
              onChange={(e) => updatePageContentField('metaTitle', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
            />
          </div>

          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="Meta Description"
              value={pageContent[currentLanguage].metaDescription}
              onChange={(e) => updatePageContentField('metaDescription', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
            />
          </div>

          

          <div>
            <Label htmlFor="heading">Heading page</Label>
            <Input
              id="heading"
              placeholder="Heading"
              value={pageContent[currentLanguage].heading}
              onChange={(e) => updatePageContentField('heading', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
            />
          </div>

          <div>
            <Label htmlFor="body-text">Body Text</Label>
            <ReactQuill
              theme="snow"
              value={pageContent[currentLanguage].bodyText}
              onChange={(content) => updatePageContentField('bodyText', content)}
              modules={quillModules}
              formats={quillFormats}
              className="bg-white"
            />
          </div>

          <div>
            <Label htmlFor="cta-text">CTA Button Text</Label>
            <Input
              id="cta-text"
              placeholder="CTA Button Text"
              value={pageContent[currentLanguage].ctaText}
              onChange={(e) => updatePageContentField('ctaText', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <Button type="button" onClick={addFaq} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </div>

            {pageContent[currentLanguage].faqs.map((faq: FAQ, index: number) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-md">FAQ {index + 1}</CardTitle>
                  <Button type="button" variant="ghost" onClick={() => removeFaq(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label htmlFor={`faq-question-${index}`}>Question</Label>
                    <Input
                      id={`faq-question-${index}`}
                      placeholder="Question"
                      value={faq.question}
                      onChange={(e) => updateFaqQuestion(index, e.target.value)}
                      className="mb-2"
                      aria-invalid={!!errors[currentLanguage]}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                    <Textarea
                      id={`faq-answer-${index}`}
                      placeholder="Answer"
                      value={faq.answer}
                      onChange={(e) => updateFaqAnswer(index, e.target.value)}
                      aria-invalid={!!errors[currentLanguage]}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Page'
            )}
          </Button>
        </form>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Form Validation</h2>
          {errors.general && (
            <Card>
              <CardHeader>
                <CardTitle>General Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  {errors.general.map((error, index) => (
                    <li key={index} className="text-red-500">{error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {languages.map((lang) => (
            <Card key={lang.code}>
              <CardHeader className="flex flex-row items-center space-x-2">
                {languageStatus[lang.code] ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <CardTitle>{lang.name}</CardTitle>
              </CardHeader>
              {errors[lang.code] && errors[lang.code].length > 0 && (
                <CardContent>
                  <ScrollArea className="h-[100px] w-full">
                    <ul className="list-disc pl-5">
                      {errors[lang.code].map((error, index) => (
                        <li key={index} className="text-red-500">{error}</li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}