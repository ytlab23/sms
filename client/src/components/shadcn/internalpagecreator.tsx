// import { useState } from 'react'
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Textarea } from "./ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { PlusCircle, Trash2, Globe } from "lucide-react"
// import { db } from '../../firebase/config' 
// import { collection, doc, setDoc } from "firebase/firestore"; 

// const languages = [
//   'en', 'es', 'pt', 'fr', 'de',
//   'it', 'ru', 'zh', 'ja', 'ar'
// ]

// export default function AdminInternalPageCreator() {
//   const [slug, setSlug] = useState('')
//   const [metaTitle, setMetaTitle] = useState('')
//   const [metaDescription, setMetaDescription] = useState('')

  
//   // const [heading, setHeading] = useState('')
//   // const [bodyText, setBodyText] = useState('')
//   // const [ctaText, setCtaText] = useState('')
//   // const [faqs, setFaqs] = useState([{ question: '', answers: {} }])

//   const [pageContent, setPageContent] = useState<any>(languages.map((lang) => ({[lang]: {
//     // slug: '',
//     // metaTitle: '',
//     // metaDescription: '',
//     heading: '',
//     bodyText: '',
//     ctaText: '',
//     faqs: [{ question: '', answer: '' }]
//   } })))



//   const [currentLanguage, setCurrentLanguage] = useState('en') // Selected language for the entire page
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   const addFaq = () => {
//     setFaqs([...faqs, { question: '', answers: {} }])
//   }

//   const removeFaq = (index: number) => {
//     const newFaqs = [...faqs]
//     newFaqs.splice(index, 1)
//     setFaqs(newFaqs)
//   }

//   const updateFaqQuestion = (index: number, question: string) => {
//     const newFaqs = [...faqs]
//     newFaqs[index].question = question
//     setFaqs(newFaqs)
//   }

//   const updateFaqAnswer = (index: number, answer: string) => {
//     const newFaqs = [...faqs]
//     newFaqs[index].answers = { ...newFaqs[index].answers, [currentLanguage]: answer }
//     setFaqs(newFaqs)
//   }

//   const validateForm = () => {
//     const newErrors: any = {}
//     if (!slug) newErrors.slug = "Slug is required."
//     if (!metaTitle) newErrors.metaTitle = "Meta Title is required."
//     if (!metaDescription) newErrors.metaDescription = "Meta Description is required."
//     if (!heading) newErrors.heading = "Heading is required."
//     if (!bodyText) newErrors.bodyText = "Body Text is required."
//     if (!ctaText) newErrors.ctaText = "CTA Text is required."
//     if (faqs.some(faq => !faq.question || !faq.answers[currentLanguage as keyof typeof faq.answers])) {
//       newErrors.faqs = "All FAQ questions and answers must be filled in for the selected language."
//     }
//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) return

//     try {
//       const docRef = doc(collection(db, "internal_pages"), slug)
//       const pageData = {
//         slug,
//         metaTitle: metaTitle ,
//         metaDescription:  metaDescription ,
//         heading:  heading ,
//         bodyText: bodyText ,
//         ctaText:  ctaText ,
//         faqs: faqs.map(faq => ({
//           question:  faq.question ,
//           answer: faq.answers[currentLanguage as keyof typeof faq.answers] 
//         }))
//       }

//       await setDoc(docRef, { [currentLanguage]: pageData }, { merge: true })
//       console.log('Page saved successfully!')
//     } catch (error) {
//       console.error('Error saving page:', error)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Create Internal Page</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
//             <SelectTrigger>
//               <Globe className="h-4 w-4 mr-2" />
//               <SelectValue   placeholder="Select Language" />
              
//             {/* <SelectItem key="en" value="en">en</SelectItem> */}

//             </SelectTrigger>
//             <SelectContent>
//               {languages.map((lang) => (
//                 <SelectItem key={lang} value={lang}>{lang}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Input
//             placeholder="Slug (e.g., buy-number-for-google)"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.slug}
//           />
//           {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

//           <Input
//             placeholder="Meta Title"
//             value={metaTitle}
//             onChange={(e) => setMetaTitle(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.metaTitle}
//           />
//           {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}

//           <Textarea
//             placeholder="Meta Description"
//             value={metaDescription}
//             onChange={(e) => setMetaDescription(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.metaDescription}
//           />
//           {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}

//           <Input
//             placeholder="Heading"
//             value={heading}
//             onChange={(e) => setHeading(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.heading}
//           />
//           {errors.heading && <p className="text-red-500 text-sm">{errors.heading}</p>}

//           <Textarea
//             placeholder="Body Text"
//             value={bodyText}
//             onChange={(e) => setBodyText(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.bodyText}
//           />
//           {errors.bodyText && <p className="text-red-500 text-sm">{errors.bodyText}</p>}

//           <Input
//             placeholder="CTA Button Text"
//             value={ctaText}
//             onChange={(e) => setCtaText(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.ctaText}
//           />
//           {errors.ctaText && <p className="text-red-500 text-sm">{errors.ctaText}</p>}

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold">FAQs</h2>
//               <Button type="button" onClick={addFaq} className="flex items-center">
//                 <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
//               </Button>
//             </div>
//             {faqs.map((faq, index) => (
//               <Card key={index} className="p-4">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">FAQ {index + 1}</CardTitle>
//                   <Button variant="destructive" size="icon" onClick={() => removeFaq(index)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </CardHeader>
//                 <CardContent>
//                   <Input
//                     placeholder="Question"
//                     value={faq.question}
//                     onChange={(e) => updateFaqQuestion(index, e.target.value)}
//                     className="w-full mb-2"
//                     aria-invalid={!!errors.faqs}
//                   />
//                   <Textarea
//                     placeholder={`Answer (${currentLanguage})`}
//                     value={faq.answers[currentLanguage as keyof typeof faq.answers] || ''}
//                     onChange={(e) => updateFaqAnswer(index, e.target.value)}
//                     className="w-full mt-2"
//                   />
//                   {errors.faqs && <p className="text-red-500 text-sm">{errors.faqs}</p>}
//                 </CardContent>
//               </Card>
//             ))}
//           </div>

//           <Button type="submit" className="w-full">Create Page</Button>
//         </form>

//         <div className="space-y-4">
//           <h2 className="text-2xl font-bold mb-4">Preview</h2>
//           <Card className="overflow-hidden">
//             <CardContent className="p-0">
//               <div className="bg-gray-100 p-4 border-b">
//                 <div className="flex items-center text-sm text-gray-500">
//                   <Globe className="mr-2 h-4 w-4" /> {currentLanguage}
//                 </div>
//               </div>
//               <div className="p-4">
//                 <h3 className="text-xl font-bold">{heading}</h3>
//                 <p>{bodyText}</p>
//                 <Button variant="default" className="mt-4">{ctaText}</Button>

//                 <div className="mt-6 space-y-4">
//                   {faqs.map((faq, index) => (
//                     <div key={index}>
//                       <h4 className="font-semibold">{faq.question}</h4>
//                       <p>{faq.answers[currentLanguage as keyof typeof faq.answers]}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
//change it to typescript

// works but need mod


// import { useState } from 'react'
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Textarea } from "./ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { PlusCircle, Trash2, Globe } from "lucide-react"
// import { db } from '../../firebase/config' 
// import { collection, doc, setDoc } from "firebase/firestore"; 

// const languages = [
//   'en', 'es', 'pt', 'fr', 'de',
//   'it', 'ru', 'zh', 'ja', 'ar'
// ]

// export default function AdminInternalPageCreator() {
//   const [slug, setSlug] = useState('')
//   const [metaTitle, setMetaTitle] = useState('')
//   const [metaDescription, setMetaDescription] = useState('')
//   const [pageContent, setPageContent] = useState<any>(
//     languages.reduce((acc, lang) => ({
//       ...acc, 
//       [lang]: { 
//         heading: '', 
//         bodyText: '', 
//         ctaText: '', 
//         faqs: [{ question: '', answer: '' }]
//       }
//     }), {})
//   )
//   const [currentLanguage, setCurrentLanguage] = useState('en') // Selected language for the entire page
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   // Save content for the current language before switching
//   const handleLanguageChange = (newLanguage: string) => {
//     // Ensure content is saved for the current language
//     setCurrentLanguage(newLanguage)
//   }

//   const addFaq = () => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         faqs: [...prevContent[currentLanguage].faqs, { question: '', answer: '' }]
//       }
//     }))
//   }

//   const removeFaq = (index: number) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         faqs: prevContent[currentLanguage].faqs.filter((_: any, i: number) => i !== index)
//       }
//     }))
//   }

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: any) => {
//       const faqs = [...prevContent[currentLanguage].faqs]
//       faqs[index].question = question
//       return {
//         ...prevContent,
//         [currentLanguage]: {
//           ...prevContent[currentLanguage],
//           faqs
//         }
//       }
//     })
//   }

//   const updateFaqAnswer = (index: number, answer: string) => {
//     setPageContent((prevContent: any) => {
//       const faqs = [...prevContent[currentLanguage].faqs]
//       faqs[index].answer = answer
//       return {
//         ...prevContent,
//         [currentLanguage]: {
//           ...prevContent[currentLanguage],
//           faqs
//         }
//       }
//     })
//   }

//   const updatePageContentField = (field: string, value: string) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }))
//   }

//   const validateForm = () => {
//     const newErrors: any = {}

//     // Slug, Meta Title, and Meta Description are shared across all languages
//     if (!slug) newErrors.slug = "Slug is required."
//     if (!metaTitle) newErrors.metaTitle = "Meta Title is required."
//     if (!metaDescription) newErrors.metaDescription = "Meta Description is required."

//     // Validate content for each language
//     languages.forEach((lang) => {
//       const content = pageContent[lang]

//       if (!content.heading) {
//         newErrors[`${lang}_heading`] = `Heading is required for ${lang}.`
//       }

//       if (!content.bodyText) {
//         newErrors[`${lang}_bodyText`] = `Body Text is required for ${lang}.`
//       }

//       if (!content.ctaText) {
//         newErrors[`${lang}_ctaText`] = `CTA Text is required for ${lang}.`
//       }

//       if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
//         newErrors[`${lang}_faqs`] = `All FAQ questions and answers must be filled in for ${lang}.`
//       }
//     })

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) return

//     try {
//       const docRef = doc(collection(db, "internal_pages"), slug)
//       const pageData = {
//         slug,
//         metaTitle,
//         metaDescription,
//         pageContent,
//       }

//       await setDoc(docRef, pageData, { merge: true })
//       console.log('Page saved successfully!')
//     } catch (error) {
//       console.error('Error saving page:', error)
//     }
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Create Internal Page</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Select value={currentLanguage} onValueChange={handleLanguageChange}>
//             <SelectTrigger>
//               <Globe className="h-4 w-4 mr-2" />
//               <SelectValue placeholder="Select Language" />
//             </SelectTrigger>
//             <SelectContent>
//               {languages.map((lang) => (
//                 <SelectItem key={lang} value={lang}>{lang}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Input
//             placeholder="Slug (e.g., buy-number-for-google)"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.slug}
//           />
//           {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

//           <Input
//             placeholder="Meta Title"
//             value={metaTitle}
//             onChange={(e) => setMetaTitle(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.metaTitle}
//           />
//           {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}

//           <Textarea
//             placeholder="Meta Description"
//             value={metaDescription}
//             onChange={(e) => setMetaDescription(e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors.metaDescription}
//           />
//           {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}

//           <Input
//             placeholder="Heading"
//             value={pageContent[currentLanguage].heading}
//             onChange={(e) => updatePageContentField('heading', e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors[`${currentLanguage}_heading`]}
//           />
//           {errors[`${currentLanguage}_heading`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_heading`]}</p>}

//           <Textarea
//             placeholder="Body Text"
//             value={pageContent[currentLanguage].bodyText}
//             onChange={(e) => updatePageContentField('bodyText', e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors[`${currentLanguage}_bodyText`]}
//           />
//           {errors[`${currentLanguage}_bodyText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_bodyText`]}</p>}

//           <Input
//             placeholder="CTA Button Text"
//             value={pageContent[currentLanguage].ctaText}
//             onChange={(e) => updatePageContentField('ctaText', e.target.value)}
//             className="w-full"
//             aria-invalid={!!errors[`${currentLanguage}_ctaText`]}
//           />
//           {errors[`${currentLanguage}_ctaText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_ctaText`]}</p>}

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold">FAQs</h2>
//               <Button type="button" onClick={addFaq} className="flex items-center">
//                 <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
//               </Button>
//             </div>
//             {pageContent[currentLanguage].faqs.map((faq: any, index: number) => (
//               <Card key={index} className="p-4">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-md">FAQ {index + 1}</CardTitle>
//                   <Button type="button" variant="ghost" onClick={() => removeFaq(index)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <Input
//                     placeholder="Question"
//                     value={faq.question}
//                     onChange={(e) => updateFaqQuestion(index, e.target.value)}
//                     className="mb-2"
//                     aria-invalid={!!errors[`${currentLanguage}_faqs`]}
//                   />
//                   <Textarea
//                     placeholder="Answer"
//                     value={faq.answer}
//                     onChange={(e) => updateFaqAnswer(index, e.target.value)}
//                     aria-invalid={!!errors[`${currentLanguage}_faqs`]}
//                   />
//                 </CardContent>
//               </Card>
//             ))}
//             {errors[`${currentLanguage}_faqs`] && (
//               <p className="text-red-500 text-sm">{errors[`${currentLanguage}_faqs`]}</p>
//             )}
//           </div>

//           <Button type="submit" className="w-full">
//             Save Page
//           </Button>
//         </form>
//       </div>
//     </div>
//   )
// }

//change it to typescript

// change it to typescript

import { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PlusCircle, Trash2, Globe } from "lucide-react";
import { db } from '../../firebase/config'; 
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
import { useParams } from 'react-router-dom';

const languages = [
  'en', 'es', 'pt', 'fr', 'de',
  'it', 'ru', 'zh', 'ja', 'ar'
];

export default function AdminInternalPageCreator() {
  const { slug: pageSlug } = useParams();
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [pageContent, setPageContent] = useState<any>(
    languages.reduce((acc, lang) => ({
      ...acc, 
      [lang]: { 
        heading: '', 
        bodyText: '', 
        ctaText: '', 
        faqs: [{ question: '', answer: '' }]
      }
    }), {})
  );
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };
  useEffect(() => {
    const fetchPageData = async () => {
      if (pageSlug) {
        try {
          const docRef = doc(db, "internal_pages", pageSlug);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSlug(data.slug); // Set slug
            setMetaTitle(data.metaTitle); // Set meta title
            setMetaDescription(data.metaDescription); // Set meta description
  
            // Set page content with data from Firestore
            if (data.pageContent) {
              setPageContent(data.pageContent);
            }
          } else {
            console.log("No such page found!");
          }
        } catch (error) {
          console.error("Error fetching page data:", error);
        }
      }
    };
   console.log(pageSlug);
    fetchPageData();
  }, [pageSlug]);
  

  const addFaq = () => {
    setPageContent((prevContent: any) => {
      const updatedContent = { ...prevContent };
      languages.forEach((lang) => {
        updatedContent[lang] = {
          ...prevContent[lang],
          faqs: [...prevContent[lang].faqs, { question: '', answer: '' }]
        };
      });
      return updatedContent;
    });
  };

  const removeFaq = (index: number) => {
    setPageContent((prevContent: any) => {
      const updatedContent = { ...prevContent };
      languages.forEach((lang) => {
        updatedContent[lang] = {
          ...prevContent[lang],
          faqs: prevContent[lang].faqs.filter((_: any, i: number) => i !== index)
        };
      });
      return updatedContent;
    });
  };

  const updateFaqQuestion = (index: number, question: string) => {
    setPageContent((prevContent: any) => {
      const faqs = [...prevContent[currentLanguage].faqs];
      faqs[index].question = question;
      return {
        ...prevContent,
        [currentLanguage]: {
          ...prevContent[currentLanguage],
          faqs
        }
      };
    });
  };

  const updateFaqAnswer = (index: number, answer: string) => {
    setPageContent((prevContent: any) => {
      const faqs = [...prevContent[currentLanguage].faqs];
      faqs[index].answer = answer;
      return {
        ...prevContent,
        [currentLanguage]: {
          ...prevContent[currentLanguage],
          faqs
        }
      };
    });
  };

  const updatePageContentField = (field: string, value: string) => {
    setPageContent((prevContent: any) => ({
      ...prevContent,
      [currentLanguage]: {
        ...prevContent[currentLanguage],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!slug) newErrors.slug = "Slug is required.";
    if (!metaTitle) newErrors.metaTitle = "Meta Title is required.";
    if (!metaDescription) newErrors.metaDescription = "Meta Description is required.";

    languages.forEach((lang) => {
      const content = pageContent[lang];

      if (!content.heading) {
        newErrors[`${lang}_heading`] = `Heading is required for ${lang}.`;
      }

      if (!content.bodyText) {
        newErrors[`${lang}_bodyText`] = `Body Text is required for ${lang}.`;
      }

      if (!content.ctaText) {
        newErrors[`${lang}_ctaText`] = `CTA Text is required for ${lang}.`;
      }

      if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
        newErrors[`${lang}_faqs`] = `All FAQ questions and answers must be filled in for ${lang}.`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const docRef = doc(collection(db, "internal_pages"), slug);
      const pageData = {
        slug,
        metaTitle,
        metaDescription,
        pageContent,
      };

      await setDoc(docRef, pageData, { merge: true });
      console.log('Page saved successfully!');
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Internal Page</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Slug (e.g., buy-number-for-google)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.slug}
          />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}

          <Input
            placeholder="Meta Title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.metaTitle}
          />
          {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}

          <Textarea
            placeholder="Meta Description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.metaDescription}
          />
          {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}

          <Input
            placeholder="Heading"
            value={pageContent[currentLanguage].heading}
            onChange={(e) => updatePageContentField('heading', e.target.value)}
            className="w-full"
            aria-invalid={!!errors[`${currentLanguage}_heading`]}
          />
          {errors[`${currentLanguage}_heading`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_heading`]}</p>}

          <Textarea
            placeholder="Body Text"
            value={pageContent[currentLanguage].bodyText}
            onChange={(e) => updatePageContentField('bodyText', e.target.value)}
            className="w-full"
            aria-invalid={!!errors[`${currentLanguage}_bodyText`]}
          />
          {errors[`${currentLanguage}_bodyText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_bodyText`]}</p>}

          <Input
            placeholder="CTA Button Text"
            value={pageContent[currentLanguage].ctaText}
            onChange={(e) => updatePageContentField('ctaText', e.target.value)}
            className="w-full"
            aria-invalid={!!errors[`${currentLanguage}_ctaText`]}
          />
          {errors[`${currentLanguage}_ctaText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_ctaText`]}</p>}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <Button type="button" onClick={addFaq} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </div>

            {pageContent[currentLanguage].faqs.map((faq: any, index: number) => (
              <Card key={index} className="mb-4">
                <CardHeader className="flex justify-between">
                  <CardTitle className="text-md">FAQ {index + 1}</CardTitle>
                  <Button type="button" variant="ghost" onClick={() => removeFaq(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaqQuestion(index, e.target.value)}
                    className="mb-2"
                    aria-invalid={!!errors[`${currentLanguage}_faqs`]}
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => updateFaqAnswer(index, e.target.value)}
                    aria-invalid={!!errors[`${currentLanguage}_faqs`]}
                  />
                </CardContent>
              </Card>
            ))}

            {errors[`${currentLanguage}_faqs`] && (
              <p className="text-red-500 text-sm">{errors[`${currentLanguage}_faqs`]}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save Page
          </Button>
        </form>
      </div>
    </div>
  );
}
