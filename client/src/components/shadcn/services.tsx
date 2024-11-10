
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
import DOMPurify from 'dompurify';
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
  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) };
  };
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
        }
      } catch (error) {
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
          const pricingRef = doc(db, 'pricing', pricingKey)
          const pricingSnapshot = await getDoc(pricingRef)
          
          if (pricingSnapshot.exists()) {
            setPrice(pricingSnapshot.data().price)
          } else {
            const serviceRef = doc(db, 'services', pageData.service.toLowerCase())
            const serviceSnapshot = await getDoc(serviceRef)
            
            if (serviceSnapshot.exists()) {
              setPrice(serviceSnapshot.data().price)
            } else {
              setPrice(null)
            }
          }
        } catch (error) {
          setPrice(null)
        }
      }
    }

    fetchPrice()
  }, [selectedCountry, pageData])

  const buyProduct = async () => {
    setBuying(true)
    setFailedToBuy(false)
    const country = selectedCountry?.name.toLowerCase()
    const product = pageData?.service.toLowerCase()


    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/buy-product',
        {
          uid: currentUser?.uid,
          country,
          product,
        },
      )

      const id = response.data?.product?.id ?? null

      setSelectedCountry(null)
      setPrice(null)

      toast({
        variant: 'success',
        title: 'Product Purchased Successfully',
        description: 'You Can Now Use The Service',
      })
      // navigate(`/sms?id=${id}`)
      navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)

      setBuying(false)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title:'Insufficient Balance',
            description: 'Please TopUp Your Account',
            action: (
              <ToastAction
                onClick={() => navigate(`${i18n.language}/${t("urls.pay")}`)}
                altText='Go To Payment'
              >
                Go To Payment
              </ToastAction>
            ),
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Purchase Failed',
            description: 'Something Went Wrong',
          })
          setFailedToBuy(true)
          setBuying(false)
        }
      } else {
        setFailedToBuy(true)
        setBuying(false)
        toast({
          variant: 'destructive',
          title: 'Unknown Error',
          description: 'Unknown ErrorOccurred',
          action: (
            <ToastAction onClick={buyProduct} altText='Try Again'>
              Try Again
            </ToastAction>
          ),
        })
      }
      setFailedToBuy(true)
      setBuying(false)
    }
  }

  const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <button
          className="flex justify-between items-center w-full p-4 text-left dark:text-black bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-lg font-semibold text-gray-800 ">{question}</span>
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
              <div className="p-4  text-gray-700 text-lg leading-relaxed">
                {answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (loading) {
    return <p className="text-center py-8">{t('service.Loading')}</p>
  }

  if (!pageData) {
    navigate('/404');
    return <p className="text-center py-8">{t('pageNotFound')}</p>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b dark:bg-boxdark-2">
      <header className="py-8 text-center dark:bg-boxdark shadow-sm">
        <h1 className="text-4xl font-bold text-gray-900 px-4">{pageData.heading || t('service.Heading Not Available')}</h1>
      </header>

      <main className="container mx-auto px-4 py-12">
        <Card className="overflow-hidden mb-12 shadow-lg">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('service.About Our Service')}</h2>
                {/* <p className="mb-8 text-lg text-gray-700 leading-relaxed">{pageData.bodyText || t('service.Description Not Available')}</p> */}
                <div className="container mx-auto px-4 py-8">
      <div 
        className="rich-text-content mb-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={createMarkup(pageData.bodyText || t('service.Description Not Available'))}
      />
      {/* ... other content */}

      <style jsx>{`
        .rich-text-content a {
          color: #3b82f6;
          text-decoration: underline;
          transition: color 0.3s ease;
        }
        .rich-text-content a:hover {
          color: #1d4ed8;
        }
        .rich-text-content a:visited {
          color: #8b5cf6;
        }
        .rich-text-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .rich-text-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 0.5em;
        }
        .rich-text-content p {
          margin-bottom: 1em;
        }
        .rich-text-content ul, .rich-text-content ol {
          margin-bottom: 1em;
          padding-left: 2em;
        }
        .rich-text-content li {
          margin-bottom: 0.5em;
        }
        .rich-text-content img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
        }
        @media (prefers-color-scheme: dark) {
          .rich-text-content a {
            color: #60a5fa;
          }
          .rich-text-content a:hover {
            color: #93c5fd;
          }
          .rich-text-content a:visited {
            color: #a78bfa;
          }
        }
      `}</style>
    </div>

                <ul className="space-y-4 mb-8">
                  {pageData.features?.length ? (
                    pageData.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-6 w-6 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <></>
                  )}
                </ul>
                <div className="mt-8 ">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{t('service.Get Started Now')}</h3>
                  <Select value={selectedCountry?.value} onValueChange={(value: string) => setSelectedCountry(countries.find(c => c.value === value) || null)}>
                    <SelectTrigger className="w-full mb-4">
                      <SelectValue placeholder={t('service.Select Country')} />
                    </SelectTrigger>
                    <SelectContent className="z-9999 bg-slate-100">
                      {countries.map((country) => (
                        <SelectItem className ="hover:text-blue-600" key={country.value} value={country.value}>
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
                      t('service.Processing')
                    ) : selectedCountry ? (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {t('service.Buy Service', { service: pageData.service })} - {price ? `$${price.toFixed(2)}` : t('service.Price Unavailable')}
                      </>
                    ) : (
                      pageData.ctaText || t('service.Buy Number')
                    )}
                  </Button>
                  {failedToBuy && (
                    <p className="mt-2 text-red-500">{t('service.Failed To Buy')}</p>
                  )}
                </div>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:bg-boxdark flex flex-col justify-center items-center">
                <Globe className="w-16 h-16 text-blue-600 mb-4" />
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-black">{t('service.Available Service')}</h3>
                <div className="text-3xl font-bold text-blue-700 mb-4">{pageData.service}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="mb-12 ">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">{t('frequentlyAskedQuestions')}</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {pageData.faqs?.length ? (
              pageData.faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))
            ) : (
              <p className="text-gray-700 text-center">{t('service.No Faqs Available')}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}