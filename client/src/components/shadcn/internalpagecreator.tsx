// import { useState } from 'react'
// import { Button } from "./ui/button"
// import { Input } from "./ui/input"
// import { Textarea } from "./ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { PlusCircle, Trash2, Globe, ArrowRight } from "lucide-react"

// const languages = [
//   'English', 'Spanish', 'Portuguese', 'French', 'German',
//   'Italian', 'Russian', 'Chinese', 'Japanese', 'Arabic'
// ]

// export default function AdminInternalPageCreator() {
//   const [slug, setSlug] = useState('')
//   const [metaTitle, setMetaTitle] = useState('')
//   const [metaDescription, setMetaDescription] = useState('')
//   const [heading, setHeading] = useState('')
//   const [bodyText, setBodyText] = useState('')
//   const [ctaText, setCtaText] = useState('')
//   const [faqs, setFaqs] = useState<{ question: string, answers: { [key: string]: string } }[]>([{ question: '', answers: {} }])
//   const [currentLanguage, setCurrentLanguage] = useState('English')

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

//   const updateFaqAnswer = (index: number, language: string, answer: string) => {
//     const newFaqs = [...faqs]
//     newFaqs[index].answers = { ...newFaqs[index].answers, [language]: answer }
//     setFaqs(newFaqs)
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log({ slug, metaTitle, metaDescription, heading, bodyText, ctaText, faqs })
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Create Internal Page</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             placeholder="Slug (e.g., buy-number-for-google)"
//             value={slug}
//             onChange={(e) => setSlug(e.target.value)}
//             className="w-full"
//           />
//           <Input
//             placeholder="Meta Title"
//             value={metaTitle}
//             onChange={(e) => setMetaTitle(e.target.value)}
//             className="w-full"
//           />
//           <Textarea
//             placeholder="Meta Description"
//             value={metaDescription}
//             onChange={(e) => setMetaDescription(e.target.value)}
//             className="w-full"
//           />
//           <Input
//             placeholder="Heading"
//             value={heading}
//             onChange={(e) => setHeading(e.target.value)}
//             className="w-full"
//           />
//           <Textarea
//             placeholder="Body Text"
//             value={bodyText}
//             onChange={(e) => setBodyText(e.target.value)}
//             className="w-full"
//           />
//           <Input
//             placeholder="CTA Button Text"
//             value={ctaText}
//             onChange={(e) => setCtaText(e.target.value)}
//             className="w-full"
//           />

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
//                   />
//                   <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select language for answer" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {languages.map((lang) => (
//                         <SelectItem key={lang} value={lang}>{lang}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <Textarea
//                     placeholder={`Answer (${currentLanguage})`}
//                     value={faq.answers[currentLanguage] || ''}
//                     onChange={(e) => updateFaqAnswer(index, currentLanguage, e.target.value)}
//                     className="w-full mt-2"
//                   />
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
//                   <Globe className="h-4 w-4 mr-2" />
//                   <span>{slug || 'example-slug'}</span>
//                 </div>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-800 mb-2">{metaTitle || 'Meta Title'}</h1>
//                   <p className="text-sm text-gray-600">{metaDescription || 'Meta Description'}</p>
//                 </div>
//                 <div className="space-y-4">
//                   <h2 className="text-3xl font-bold text-gray-900">{heading || 'Page Heading'}</h2>
//                   <p className="text-gray-700">{bodyText || 'Your page content goes here...'}</p>
//                   <Button className="mt-4">
//                     {ctaText || 'Call to Action'}
//                     <ArrowRight className="ml-2 h-4 w-4" />
//                   </Button>
//                 </div>
//                 {faqs.length > 0 && (
//                   <div className="mt-8">
//                     <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
//                     <div className="space-y-4">
//                       {faqs.map((faq, index) => (
//                         <div key={index} className="border-b border-gray-200 pb-4">
//                           <h4 className="text-lg font-semibold text-gray-800 mb-2">{faq.question || `Question ${index + 1}`}</h4>
//                           <p className="text-gray-600">{faq.answers[currentLanguage] || `Answer in ${currentLanguage}`}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }
import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { PlusCircle, Trash2, Globe } from "lucide-react"
import { db } from '../../firebase/config' 
import { collection, doc, setDoc } from "firebase/firestore"; 

const languages = [
  'en', 'es', 'pt', 'fr', 'de',
  'it', 'ru', 'zh', 'ja', 'ar'
]

export default function AdminInternalPageCreator() {
  const [slug, setSlug] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [heading, setHeading] = useState('')
  const [bodyText, setBodyText] = useState('')
  const [ctaText, setCtaText] = useState('')
  const [faqs, setFaqs] = useState([{ question: '', answers: {} }])
  const [currentLanguage, setCurrentLanguage] = useState('English') // Selected language for the entire page
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const addFaq = () => {
    setFaqs([...faqs, { question: '', answers: {} }])
  }

  const removeFaq = (index: number) => {
    const newFaqs = [...faqs]
    newFaqs.splice(index, 1)
    setFaqs(newFaqs)
  }

  const updateFaqQuestion = (index: number, question: string) => {
    const newFaqs = [...faqs]
    newFaqs[index].question = question
    setFaqs(newFaqs)
  }

  const updateFaqAnswer = (index: number, answer: string) => {
    const newFaqs = [...faqs]
    newFaqs[index].answers = { ...newFaqs[index].answers, [currentLanguage]: answer }
    setFaqs(newFaqs)
  }

  const validateForm = () => {
    const newErrors: any = {}
    if (!slug) newErrors.slug = "Slug is required."
    if (!metaTitle) newErrors.metaTitle = "Meta Title is required."
    if (!metaDescription) newErrors.metaDescription = "Meta Description is required."
    if (!heading) newErrors.heading = "Heading is required."
    if (!bodyText) newErrors.bodyText = "Body Text is required."
    if (!ctaText) newErrors.ctaText = "CTA Text is required."
    if (faqs.some(faq => !faq.question || !faq.answers[currentLanguage as keyof typeof faq.answers])) {
      newErrors.faqs = "All FAQ questions and answers must be filled in for the selected language."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      const docRef = doc(collection(db, "internal_pages"), slug)
      const pageData = {
        slug,
        metaTitle: metaTitle ,
        metaDescription:  metaDescription ,
        heading:  heading ,
        bodyText: bodyText ,
        ctaText:  ctaText ,
        faqs: faqs.map(faq => ({
          question:  faq.question ,
          answer: faq.answers[currentLanguage as keyof typeof faq.answers] 
        }))
      }

      await setDoc(docRef, { [currentLanguage]: pageData }, { merge: true })
      console.log('Page saved successfully!')
    } catch (error) {
      console.error('Error saving page:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create Internal Page</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
            <SelectTrigger>
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
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.heading}
          />
          {errors.heading && <p className="text-red-500 text-sm">{errors.heading}</p>}

          <Textarea
            placeholder="Body Text"
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.bodyText}
          />
          {errors.bodyText && <p className="text-red-500 text-sm">{errors.bodyText}</p>}

          <Input
            placeholder="CTA Button Text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            className="w-full"
            aria-invalid={!!errors.ctaText}
          />
          {errors.ctaText && <p className="text-red-500 text-sm">{errors.ctaText}</p>}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">FAQs</h2>
              <Button type="button" onClick={addFaq} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" /> Add FAQ
              </Button>
            </div>
            {faqs.map((faq, index) => (
              <Card key={index} className="p-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">FAQ {index + 1}</CardTitle>
                  <Button variant="destructive" size="icon" onClick={() => removeFaq(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => updateFaqQuestion(index, e.target.value)}
                    className="w-full mb-2"
                    aria-invalid={!!errors.faqs}
                  />
                  <Textarea
                    placeholder={`Answer (${currentLanguage})`}
                    value={faq.answers[currentLanguage as keyof typeof faq.answers] || ''}
                    onChange={(e) => updateFaqAnswer(index, e.target.value)}
                    className="w-full mt-2"
                  />
                  {errors.faqs && <p className="text-red-500 text-sm">{errors.faqs}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          <Button type="submit" className="w-full">Create Page</Button>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Preview</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gray-100 p-4 border-b">
                <div className="flex items-center text-sm text-gray-500">
                  <Globe className="mr-2 h-4 w-4" /> {currentLanguage}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{heading}</h3>
                <p>{bodyText}</p>
                <Button variant="default" className="mt-4">{ctaText}</Button>

                <div className="mt-6 space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-semibold">{faq.question}</h4>
                      <p>{faq.answers[currentLanguage as keyof typeof faq.answers]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
