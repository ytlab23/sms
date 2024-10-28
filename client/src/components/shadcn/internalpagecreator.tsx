
// import { useEffect, useState } from 'react';
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { PlusCircle, Trash2, Globe } from "lucide-react";
// import { db } from '../../firebase/config'; 
// import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
// import { useParams } from 'react-router-dom';

// const languages = [
//   'en', 'es', 'pt', 'fr', 'de',
//   'it', 'ru', 'zh', 'ja', 'ar'
// ];

// export default function AdminInternalPageCreator() {
//   const { slug: pageSlug } = useParams();
//   const [slug, setSlug] = useState('');
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
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
//   );
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const handleLanguageChange = (newLanguage: string) => {
//     setCurrentLanguage(newLanguage);
//   };
//   useEffect(() => {
//     const fetchPageData = async () => {
//       if (pageSlug) {
//         try {
//           const docRef = doc(db, "internal_pages", pageSlug);
//           const docSnap = await getDoc(docRef);
  
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setSlug(data.slug); // Set slug
//             setMetaTitle(data.metaTitle); // Set meta title
//             setMetaDescription(data.metaDescription); // Set meta description
  
//             // Set page content with data from Firestore
//             if (data.pageContent) {
//               setPageContent(data.pageContent);
//             }
//           } else {
//             console.log("No such page found!");
//           }
//         } catch (error) {
//           console.error("Error fetching page data:", error);
//         }
//       }
//     };
//    console.log(pageSlug);
//     fetchPageData();
//   }, [pageSlug]);
  

//   const addFaq = () => {
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang] = {
//           ...prevContent[lang],
//           faqs: [...prevContent[lang].faqs, { question: '', answer: '' }]
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const removeFaq = (index: number) => {
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang] = {
//           ...prevContent[lang],
//           faqs: prevContent[lang].faqs.filter((_: any, i: number) => i !== index)
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: any) => {
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
//     setPageContent((prevContent: any) => {
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

//   const updatePageContentField = (field: string, value: string) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: any = {};

//     if (!slug) newErrors.slug = "Slug is required.";
//     if (!metaTitle) newErrors.metaTitle = "Meta Title is required.";
//     if (!metaDescription) newErrors.metaDescription = "Meta Description is required.";

//     languages.forEach((lang) => {
//       const content = pageContent[lang];

//       if (!content.heading) {
//         newErrors[`${lang}_heading`] = `Heading is required for ${lang}.`;
//       }

//       if (!content.bodyText) {
//         newErrors[`${lang}_bodyText`] = `Body Text is required for ${lang}.`;
//       }

//       if (!content.ctaText) {
//         newErrors[`${lang}_ctaText`] = `CTA Text is required for ${lang}.`;
//       }

//       if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
//         newErrors[`${lang}_faqs`] = `All FAQ questions and answers must be filled in for ${lang}.`;
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     try {
//       const docRef = doc(collection(db, "internal_pages"), slug);
//       const pageData = {
//         slug,
//         metaTitle,
//         metaDescription,
//         pageContent,
//       };

//       await setDoc(docRef, pageData, { merge: true });
//       console.log('Page saved successfully!');
//     } catch (error) {
//       console.error('Error saving page:', error);
//     }
//   };

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
//               <Card key={index} className="mb-4">
//                 <CardHeader className="flex justify-between">
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
//   );
// }
//222222222222222222222222
// import { useEffect, useState } from 'react';
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Label } from "./ui/label";
// import { PlusCircle, Trash2, Globe, CheckCircle, XCircle } from "lucide-react";
// import { db } from '../../firebase/config'; 
// import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
// import { useParams } from 'react-router-dom';

// const languages = [
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

// export default function AdminInternalPageCreator() {
//   const { slug: pageSlug } = useParams();
//   const [slug, setSlug] = useState('');
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [pageContent, setPageContent] = useState<any>(
//     languages.reduce((acc, lang) => ({
//       ...acc, 
//       [lang.code]: { 
//         heading: '', 
//         bodyText: '', 
//         ctaText: '', 
//         faqs: [{ question: '', answer: '' }]
//       }
//     }), {})
//   );
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const [languageStatus, setLanguageStatus] = useState<{ [key: string]: boolean }>({});

//   const handleLanguageChange = (newLanguage: string) => {
//     setCurrentLanguage(newLanguage);
//   };

//   useEffect(() => {
//     const fetchPageData = async () => {
//       if (pageSlug) {
//         try {
//           const docRef = doc(db, "internal_pages", pageSlug);
//           const docSnap = await getDoc(docRef);
  
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setSlug(data.slug);
//             setMetaTitle(data.metaTitle);
//             setMetaDescription(data.metaDescription);
  
//             if (data.pageContent) {
//               setPageContent(data.pageContent);
//             }
//           } else {
//             console.log("No such page found!");
//           }
//         } catch (error) {
//           console.error("Error fetching page data:", error);
//         }
//       }
//     };

//     fetchPageData();
//   }, [pageSlug]);

//   useEffect(() => {
//     validateForm();
//   }, [pageContent, slug, metaTitle, metaDescription]);

//   const addFaq = () => {
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
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
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang.code] = {
//           ...prevContent[lang.code],
//           faqs: prevContent[lang.code].faqs.filter((_: any, i: number) => i !== index)
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: any) => {
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
//     setPageContent((prevContent: any) => {
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

//   const updatePageContentField = (field: string, value: string) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: any = {};
//     const newLanguageStatus: { [key: string]: boolean } = {};

//     if (!slug) newErrors.slug = "Slug is required.";
//     if (!metaTitle) newErrors.metaTitle = "Meta Title is required.";
//     if (!metaDescription) newErrors.metaDescription = "Meta Description is required.";

//     languages.forEach((lang) => {
//       const content = pageContent[lang.code];
//       let isLanguageComplete = true;

//       if (!content.heading) {
//         newErrors[`${lang.code}_heading`] = `Heading is required for ${lang.name}.`;
//         isLanguageComplete = false;
//       }

//       if (!content.bodyText) {
//         newErrors[`${lang.code}_bodyText`] = `Body Text is required for ${lang.name}.`;
//         isLanguageComplete = false;
//       }

//       if (!content.ctaText) {
//         newErrors[`${lang.code}_ctaText`] = `CTA Text is required for ${lang.name}.`;
//         isLanguageComplete = false;
//       }

//       if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
//         newErrors[`${lang.code}_faqs`] = `All FAQ questions and answers must be filled in for ${lang.name}.`;
//         isLanguageComplete = false;
//       }

//       newLanguageStatus[lang.code] = isLanguageComplete;
//     });

//     setErrors(newErrors);
//     setLanguageStatus(newLanguageStatus);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     try {
//       const docRef = doc(collection(db, "internal_pages"), slug);
//       const pageData = {
//         slug,
//         metaTitle,
//         metaDescription,
//         pageContent,
//       };

//       await setDoc(docRef, pageData, { merge: true });
//       console.log('Page saved successfully!');
//     } catch (error) {
//       console.error('Error saving page:', error);
//     }
//   };

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
//               value={slug}
//               onChange={(e) => setSlug(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.slug}
//             />
//             {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
//           </div>

//           <div>
//             <Label htmlFor="meta-title">Meta Title</Label>
//             <Input
//               id="meta-title"
//               placeholder="Meta Title"
//               value={metaTitle}
//               onChange={(e) => setMetaTitle(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.metaTitle}
//             />
//             {errors.metaTitle && <p className="text-red-500 text-sm">{errors.metaTitle}</p>}
//           </div>

//           <div>
//             <Label htmlFor="meta-description">Meta Description</Label>
//             <Textarea
//               id="meta-description"
//               placeholder="Meta Description"
//               value={metaDescription}
//               onChange={(e) => setMetaDescription(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.metaDescription}
//             />
//             {errors.metaDescription && <p className="text-red-500 text-sm">{errors.metaDescription}</p>}
//           </div>

//           <div>
//             <Label htmlFor="heading">Heading</Label>
//             <Input
//               id="heading"
//               placeholder="Heading"
//               value={pageContent[currentLanguage].heading}
//               onChange={(e) => updatePageContentField('heading', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[`${currentLanguage}_heading`]}
//             />
//             {errors[`${currentLanguage}_heading`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_heading`]}</p>}
//           </div>

//           <div>
//             <Label htmlFor="body-text">Body Text</Label>
//             <Textarea
//               id="body-text"
//               placeholder="Body Text"
//               value={pageContent[currentLanguage].bodyText}
//               onChange={(e) => updatePageContentField('bodyText', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[`${currentLanguage}_bodyText`]}
//             />
//             {errors[`${currentLanguage}_bodyText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_bodyText`]}</p>}
//           </div>

//           <div>
//             <Label htmlFor="cta-text">CTA Button Text</Label>
//             <Input
//               id="cta-text"
//               placeholder="CTA Button Text"
//               value={pageContent[currentLanguage].ctaText}
//               onChange={(e) => updatePageContentField('ctaText', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[`${currentLanguage}_ctaText`]}
//             />
//             {errors[`${currentLanguage}_ctaText`] && <p className="text-red-500 text-sm">{errors[`${currentLanguage}_ctaText`]}</p>}
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-xl font-semibold">FAQs</h2>
//               <Button type="button" onClick={addFaq} className="flex items-center">
//                 <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
//               </Button>
//             </div>

//             {pageContent[currentLanguage].faqs.map((faq: any, index: number) => (
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
//                       aria-invalid={!!errors[`${currentLanguage}_faqs`]}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
//                     <Textarea
//                       id={`faq-answer-${index}`}
//                       placeholder="Answer"
//                       value={faq.answer}
//                       onChange={(e) => updateFaqAnswer(index, e.target.value)}
//                       aria-invalid={!!errors[`${currentLanguage}_faqs`]}
//                     />
//                   </div>
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

//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">Form Validation</h2>
//           {languages.map((lang) => (
//             <div key={lang.code} className="flex items-center space-x-2">
//               {languageStatus[lang.code] ? (
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//               ) : (
//                 <XCircle className="h-5 w-5 text-red-500" />
//               )}
//               <span>{lang.name}</span>
//             </div>
//           ))}
//           {Object.entries(errors).map(([key, value]) => (
//             <p key={key} className="text-red-500 text-sm">{value}</p>
//           ))}
        
//         </div>
//       </div>
//     </div>
//   );
// }
//22222222222222222222222222222222222
//3333333333333
// import { useEffect, useState } from 'react';
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Label } from "./ui/label";
// import { ScrollArea } from "./ui/scrollarea";
// import { PlusCircle, Trash2, Globe, CheckCircle, XCircle } from "lucide-react";
// import { db } from '../../firebase/config'; 
// import { collection, doc, getDoc, setDoc } from "firebase/firestore"; 
// import { useParams } from 'react-router-dom';

// const languages = [
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

// export default function AdminInternalPageCreator() {
//   const { slug: pageSlug } = useParams();
//   const [slug, setSlug] = useState('');
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [pageContent, setPageContent] = useState<any>(
//     languages.reduce((acc, lang) => ({
//       ...acc, 
//       [lang.code]: { 
//         heading: '', 
//         bodyText: '', 
//         ctaText: '', 
//         faqs: [{ question: '', answer: '' }]
//       }
//     }), {})
//   );
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
//   const [languageStatus, setLanguageStatus] = useState<{ [key: string]: boolean }>({});

//   const handleLanguageChange = (newLanguage: string) => {
//     setCurrentLanguage(newLanguage);
//   };

//   useEffect(() => {
//     const fetchPageData = async () => {
//       if (pageSlug) {
//         try {
//           const docRef = doc(db, "internal_pages", pageSlug);
//           const docSnap = await getDoc(docRef);
  
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setSlug(data.slug);
//             setMetaTitle(data.metaTitle);
//             setMetaDescription(data.metaDescription);
  
//             if (data.pageContent) {
//               setPageContent(data.pageContent);
//             }
//           } else {
//             console.log("No such page found!");
//           }
//         } catch (error) {
//           console.error("Error fetching page data:", error);
//         }
//       }
//     };

//     fetchPageData();
//   }, [pageSlug]);

//   useEffect(() => {
//     validateForm();
//   }, [pageContent, slug, metaTitle, metaDescription]);

//   const addFaq = () => {
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
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
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang.code] = {
//           ...prevContent[lang.code],
//           faqs: prevContent[lang.code].faqs.filter((_: any, i: number) => i !== index)
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: any) => {
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
//     setPageContent((prevContent: any) => {
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

//   const updatePageContentField = (field: string, value: string) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string[] } = {};
//     const newLanguageStatus: { [key: string]: boolean } = {};

//     if (!slug) newErrors.general = ["Slug is required."];
//     if (!metaTitle) newErrors.general = [...(newErrors.general || []), "Meta Title is required."];
//     if (!metaDescription) newErrors.general = [...(newErrors.general || []), "Meta Description is required."];

//     languages.forEach((lang) => {
//       const content = pageContent[lang.code];
//       const langErrors: string[] = [];

//       if (!content.heading) {
//         langErrors.push(`Heading is required.`);
//       }

//       if (!content.bodyText) {
//         langErrors.push(`Body Text is required.`);
//       }

//       if (!content.ctaText) {
//         langErrors.push(`CTA Text is required.`);
//       }

//       if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;

//     try {
//       const docRef = doc(collection(db, "internal_pages"), slug);
//       const pageData = {
//         slug,
//         metaTitle,
//         metaDescription,
//         pageContent,
//       };

//       await setDoc(docRef, pageData, { merge: true });
//       console.log('Page saved successfully!');
//     } catch (error) {
//       console.error('Error saving page:', error);
//     }
//   };

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
//               value={slug}
//               onChange={(e) => setSlug(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-title">Meta Title</Label>
//             <Input
//               id="meta-title"
//               placeholder="Meta Title"
//               value={metaTitle}
//               onChange={(e) => setMetaTitle(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-description">Meta Description</Label>
//             <Textarea
//               id="meta-description"
//               placeholder="Meta Description"
//               value={metaDescription}
//               onChange={(e) => setMetaDescription(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="heading">Heading</Label>
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
//             <Textarea
//               id="body-text"
//               placeholder="Body Text"
//               value={pageContent[currentLanguage].bodyText}
//               onChange={(e) => updatePageContentField('bodyText', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
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

//             {pageContent[currentLanguage].faqs.map((faq: any, index: number) => (
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

//           <Button type="submit" className="w-full">
//             Save Page
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
//33333
//444444444444444
// import { useEffect, useState } from 'react';
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Textarea } from "./ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import { Label } from "./ui/label";
// import { ScrollArea } from "./ui/scrollarea";
// import { useToast } from "./ui/use-toast";
// import { PlusCircle, Trash2, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";
// import { db } from '../../firebase/config'; 
// import { collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore"; 
// import { useParams, useNavigate } from 'react-router-dom';

// const languages = [
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

// export default function AdminInternalPageCreator() {
//   const { slug: pageSlug } = useParams();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [originalSlug, setOriginalSlug] = useState('');
//   const [slug, setSlug] = useState('');
//   const [metaTitle, setMetaTitle] = useState('');
//   const [metaDescription, setMetaDescription] = useState('');
//   const [pageContent, setPageContent] = useState<any>(
//     languages.reduce((acc, lang) => ({
//       ...acc, 
//       [lang.code]: { 
//         heading: '', 
//         bodyText: '', 
//         ctaText: '', 
//         faqs: [{ question: '', answer: '' }]
//       }
//     }), {})
//   );
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
//   const [languageStatus, setLanguageStatus] = useState<{ [key: string]: boolean }>({});
//   const [isLoading, setIsLoading] = useState(false);

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
//             const data = docSnap.data();
//             setOriginalSlug(pageSlug);
//             setSlug(data.slug);
//             setMetaTitle(data.metaTitle);
//             setMetaDescription(data.metaDescription);
  
//             if (data.pageContent) {
//               setPageContent(data.pageContent);
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
//           console.error("Error fetching page data:", error);
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
//     validateForm();
//   }, [pageContent, slug, metaTitle, metaDescription]);

//   const addFaq = () => {
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
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
//     setPageContent((prevContent: any) => {
//       const updatedContent = { ...prevContent };
//       languages.forEach((lang) => {
//         updatedContent[lang.code] = {
//           ...prevContent[lang.code],
//           faqs: prevContent[lang.code].faqs.filter((_: any, i: number) => i !== index)
//         };
//       });
//       return updatedContent;
//     });
//   };

//   const updateFaqQuestion = (index: number, question: string) => {
//     setPageContent((prevContent: any) => {
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
//     setPageContent((prevContent: any) => {
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

//   const updatePageContentField = (field: string, value: string) => {
//     setPageContent((prevContent: any) => ({
//       ...prevContent,
//       [currentLanguage]: {
//         ...prevContent[currentLanguage],
//         [field]: value
//       }
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: { [key: string]: string[] } = {};
//     const newLanguageStatus: { [key: string]: boolean } = {};

//     if (!slug) newErrors.general = ["Slug is required."];
//     if (!metaTitle) newErrors.general = [...(newErrors.general || []), "Meta Title is required."];
//     if (!metaDescription) newErrors.general = [...(newErrors.general || []), "Meta Description is required."];

//     languages.forEach((lang) => {
//       const content = pageContent[lang.code];
//       const langErrors: string[] = [];

//       if (!content.heading) {
//         langErrors.push(`Heading is required.`);
//       }

//       if (!content.bodyText) {
//         langErrors.push(`Body Text is required.`);
//       }

//       if (!content.ctaText) {
//         langErrors.push(`CTA Text is required.`);
//       }

//       if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
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
//       // If the slug has changed, delete the old document and create a new one
//       if (originalSlug && originalSlug !== slug) {
//         await deleteDoc(doc(db, "internal_pages", originalSlug));
//       }

//       const docRef = doc(collection(db, "internal_pages"), slug);
//       const pageData = {
//         slug,
//         metaTitle,
//         metaDescription,
//         pageContent,
//       };

//       await setDoc(docRef, pageData, { merge: true });
      
//       toast({
//         title: "Success",
//         description: "Page saved successfully!",
//       });

//       // Update the original slug to the new one
//       setOriginalSlug(slug);

//       // If we're creating a new page, navigate to the edit page
//       if (!pageSlug) {
//         navigate(`/admin/pages/edit/${slug}`);
//       }
//     } catch (error) {
//       console.error('Error saving page:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save the page. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

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
//               value={slug}
//               onChange={(e) => setSlug(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-title">Meta Title</Label>
//             <Input
//               id="meta-title"
//               placeholder="Meta Title"
//               value={metaTitle}
//               onChange={(e) => setMetaTitle(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="meta-description">Meta Description</Label>
//             <Textarea
//               id="meta-description"
//               placeholder="Meta Description"
//               value={metaDescription}
//               onChange={(e) => setMetaDescription(e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors.general}
//             />
//           </div>

//           <div>
//             <Label htmlFor="heading">Heading</Label>
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
//             <Textarea
//               id="body-text"
//               placeholder="Body Text"
//               value={pageContent[currentLanguage].bodyText}
//               onChange={(e) => updatePageContentField('bodyText', e.target.value)}
//               className="w-full"
//               aria-invalid={!!errors[currentLanguage]}
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

//             {pageContent[currentLanguage].faqs.map((faq: any, index: number) => (
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
//4444444444444444444444444444
import { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scrollarea";
import { useToast } from "./ui/use-toast";
import { PlusCircle, Trash2, Globe, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { db } from '../../firebase/config'; 
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, where } from "firebase/firestore"; 
import { useParams, useNavigate } from 'react-router-dom';

const languages = [
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
];

interface Service {
  name: string;
  isIncluded: boolean;
}

export default function AdminInternalPageCreator() {
  const { slug: pageSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [originalSlug, setOriginalSlug] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [service, setService] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [pageContent, setPageContent] = useState<any>(
    languages.reduce((acc, lang) => ({
      ...acc, 
      [lang.code]: { 
        heading: '', 
        bodyText: '', 
        ctaText: '', 
        faqs: [{ question: '', answer: '' }]
      }
    }), {})
  );
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [languageStatus, setLanguageStatus] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
  };

  useEffect(() => {
    const fetchPageData = async () => {
      if (pageSlug) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "internal_pages", pageSlug);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            setOriginalSlug(pageSlug);
            setSlug(data.slug);
            setMetaTitle(data.metaTitle);
            setMetaDescription(data.metaDescription);
            setService(data.service || '');
  
            if (data.pageContent) {
              setPageContent(data.pageContent);
            }
          } else {
            toast({
              title: "Page not found",
              description: "The requested page does not exist.",
              variant: "destructive",
            });
            navigate('/admin/pages');
          }
        } catch (error) {
          console.error("Error fetching page data:", error);
          toast({
            title: "Error",
            description: "Failed to fetch page data. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPageData();
  }, [pageSlug, navigate, toast]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesQuery = query(collection(db, 'services'), where('isIncluded', '==', true));
        const servicesSnapshot = await getDocs(servicesQuery);
        const servicesData = servicesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            isIncluded: data.isIncluded,
          } as Service;
        });
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to fetch services. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchServices();
  }, [toast]);

  useEffect(() => {
    validateForm();
  }, [pageContent, slug, metaTitle, metaDescription, service]);

  const addFaq = () => {
    setPageContent((prevContent: any) => {
      const updatedContent = { ...prevContent };
      languages.forEach((lang) => {
        updatedContent[lang.code] = {
          ...prevContent[lang.code],
          faqs: [...prevContent[lang.code].faqs, { question: '', answer: '' }]
        };
      });
      return updatedContent;
    });
  };

  const removeFaq = (index: number) => {
    setPageContent((prevContent: any) => {
      const updatedContent = { ...prevContent };
      languages.forEach((lang) => {
        updatedContent[lang.code] = {
          ...prevContent[lang.code],
          faqs: prevContent[lang.code].faqs.filter((_: any, i: number) => i !== index)
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
    const newErrors: { [key: string]: string[] } = {};
    const newLanguageStatus: { [key: string]: boolean } = {};

    if (!slug) newErrors.general = ["Slug is required."];
    if (!metaTitle) newErrors.general = [...(newErrors.general || []), "Meta Title is required."];
    if (!metaDescription) newErrors.general = [...(newErrors.general || []), "Meta Description is required."];
    if (!service) newErrors.general = [...(newErrors.general || []), "Service is required."];

    languages.forEach((lang) => {
      const content = pageContent[lang.code];
      const langErrors: string[] = [];

      if (!content.heading) {
        langErrors.push(`Heading is required.`);
      }

      if (!content.bodyText) {
        langErrors.push(`Body Text is required.`);
      }

      if (!content.ctaText) {
        langErrors.push(`CTA Text is required.`);
      }

      if (content.faqs.some((faq: { question: string; answer: string }) => !faq.question || !faq.answer)) {
        langErrors.push(`All FAQ questions and answers must be filled in.`);
      }

      if (langErrors.length > 0) {
        newErrors[lang.code] = langErrors;
        newLanguageStatus[lang.code] = false;
      } else {
        newLanguageStatus[lang.code] = true;
      }
    });

    setErrors(newErrors);
    setLanguageStatus(newLanguageStatus);
    return Object.keys(newErrors).length === 0;
  };

  const checkSlugExists = async (slug: string): Promise<boolean> => {
    const docRef = doc(db, "internal_pages", slug);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if a page with the new slug already exists (if it's different from the original)
      if (slug !== originalSlug) {
        const slugExists = await checkSlugExists(slug);
        if (slugExists) {
          toast({
            title: "Slug Already Exists",
            description: "A page with this slug already exists. Please choose a different slug to avoid overwriting an existing page.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // If the slug has changed, delete the old document and create a new one
      if (originalSlug && originalSlug !== slug) {
        await deleteDoc(doc(db, "internal_pages", originalSlug));
      }

      const docRef = doc(collection(db, "internal_pages"), slug);
      const pageData = {
        slug,
        metaTitle,
        metaDescription,
        service,
        pageContent,
      };

      await setDoc(docRef, pageData, { merge: true });
      
      toast({
        title: "Success",
        description: "Page saved successfully!",
      });

      // Update the original slug to the new one
      setOriginalSlug(slug);

      // If we're creating a new page, navigate to the edit page
      if (!pageSlug) {
        navigate(`/admin/pages/edit/${slug}`);
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save the page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {pageSlug ? 'Update Internal Page' : 'Create Internal Page'}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
          <div>
            <Label htmlFor="language-select">Language</Label>
            <Select  value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent className="z-9999 bg-slate-100">
                {languages.map((lang) => (
                  <SelectItem className="hover:text-blue-600" key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              placeholder="e.g., buy-number-for-google"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full"
              aria-invalid={!!errors.general}
            />
          </div>

          <div>
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              placeholder="Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full"
              aria-invalid={!!errors.general}
            />
          </div>

          <div>
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full"
              aria-invalid={!!errors.general}
            />
          </div>

          <div>
            <Label htmlFor="service-select">Service</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service-select">
                <SelectValue placeholder="Select Service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.name} value={service.name}>{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="heading">Heading</Label>
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
            <Textarea
              id="body-text"
              placeholder="Body Text"
              value={pageContent[currentLanguage].bodyText}
              onChange={(e) => updatePageContentField('bodyText', e.target.value)}
              className="w-full"
              aria-invalid={!!errors[currentLanguage]}
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
              <h2 className="text-xl  font-semibold">FAQs</h2>
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
  );
}