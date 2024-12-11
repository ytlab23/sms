
import React, { useState, useEffect, useMemo } from 'react'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scrollarea'
import { RefreshCcw, ShoppingCart, ArrowUpDown } from 'lucide-react'
import { toast } from './ui/use-toast'
import { ToastAction } from './ui/toast'
import { useTranslation } from 'react-i18next'
import { CountrySelector } from './buy-service/country-selector'
import { ServiceSelector } from './buy-service/service-selector'
import { useAuth } from './../../contexts/authcontext'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './../../firebase/config'
import axios from 'axios'
import { Country, Service } from './buy-service/types'

export function ChooseService() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { t,i18n } = useTranslation()

  const [countries, setCountries] = useState<Country[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [countrySearch, setCountrySearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({})
  const [loadingPricing, setLoadingPricing] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [errorLoadingCountries, setErrorLoadingCountries] = useState(false)
  const [errorLoadingServices, setErrorLoadingServices] = useState(false)
  const [buying, setBuying] = useState(false)
  const [serviceFirst, setServiceFirst] = useState(true)
  const [statistics, setStatistics] = useState<{ [key: string]: { successfulRefunds: number, unsuccessfulRefunds: number } }>({})

  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>
    services: Record<string, boolean>
  }>(() => {
    const storedFavorites = localStorage.getItem('favorites')
    return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} }
  })

  useEffect(() => {
    fetchCountries()
    fetchServices()
    fetchAllPricing()
    fetchStatistics()
  }, [])

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const fetchCountries = async () => {
    setLoadingCountries(true)
    try {
      const countriesCollectionRef = collection(db, 'countries')
      const q = query(countriesCollectionRef, where('included', '==', true))
      const querySnapshot = await getDocs(q)
      const formattedCountries = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        iso: doc.data().iso,
        prefix: doc.data().prefix,
      }))
      setCountries(formattedCountries)
    } catch (error) {
      setErrorLoadingCountries(true)
    } finally {
      setLoadingCountries(false)
    }
  }

  const fetchServices = async () => {
    setLoadingServices(true)
    try {
      const servicesCollectionRef = collection(db, 'services')
      const querySnapshot = await getDocs(servicesCollectionRef)
      const formattedServices = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        category: doc.data().category,
        quantity: doc.data().quantity,
        price: doc.data().price,
        main: doc.data().main || false,
        isIncluded: doc.data().isIncluded || false,
      }))
      setServices(formattedServices)
    } catch (error) {
      setErrorLoadingServices(true)
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchAllPricing = async () => {
    setLoadingPricing(true)
    try {
      const pricingCollectionRef = collection(db, 'pricing')
      const querySnapshot = await getDocs(pricingCollectionRef)
      const pricingData: { [key: string]: number | null } = {}
      querySnapshot.docs.forEach((doc) => {
        pricingData[doc.id] = doc.data().price
      })
      setAllPricingData(pricingData)
    } catch (error) {
      console.error('Error fetching pricing data:', error)
    } finally {
      setLoadingPricing(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const statisticsCollectionRef = collection(db, 'statistics')
      const querySnapshot = await getDocs(statisticsCollectionRef)
      const statisticsData: { [key: string]: { successfulRefunds: number, unsuccessfulRefunds: number } } = {}
      querySnapshot.docs.forEach((doc) => {
        statisticsData[doc.id] = {
          successfulRefunds: doc.data().successfulRefunds || 0,
          unsuccessfulRefunds: doc.data().unsuccessfulRefunds || 0,
        }
      })
      setStatistics(statisticsData)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const filteredCountries = useMemo(() => {
    return countries.filter(country => 
      country.name.toLowerCase().includes(countrySearch.toLowerCase())
    )
  }, [countries, countrySearch])

  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(serviceSearch.toLowerCase())
    )
  }, [services, serviceSearch])

  const toggleFavorite = (type: 'countries' | 'services', id: string) => {
    setFavorites(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }))
  }

  const getServicePrice = (serviceName: string, countryName: string | null) => {
    if (!countryName) return null
    const key = `${countryName.toLowerCase()}_${serviceName.toLowerCase()}`
    return allPricingData[key] || null
  }

  const buyProduct = async () => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: t('actionsidebar.Authentication Required'),
        description: t('actionsidebar.Please Login'),
        action: (
          <ToastAction onClick={() => navigate(`${i18n.language}/${t("urls.auth/signin")}`)} altText="Go to login">
            {t('actionsidebar.Go to login')}
          </ToastAction>
        ),
      })
      return
    }

    if (!selectedCountry || !selectedService) {
      toast({
        variant: 'destructive',
        title: t('error.Selection Required'),
        description: t('error.Select Country And Service'),
      })
      return
    }

    setBuying(true)
    try {
      const response = await axios.post('https://smsapp-backend.vercel.app/api/buy-product', {
        uid: currentUser.uid,
        country: selectedCountry.name.toLowerCase(),
        product: selectedService.name.toLowerCase(),
      })

      const id = response.data?.product?.id ?? null

      toast({
        variant: 'success',
        title: t('actionsidebar.Purchase Complete'),
        description: t('actionsidebar.Service is Ready'),
      })
      setSelectedCountry(null);
      setSelectedService(null);
      navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: t('actionsidebar.Insufficient Balance'),
            description: t('actionsidebar.Top Up Required'),
            action: (
              <ToastAction onClick={() => navigate(`${i18n.language}/${t("urls.pay")}`)} altText="Go to payment">
                {t('actionsidebar.Go To Payment')}
              </ToastAction>
            ),
          })
        } else {
          toast({
            variant: 'destructive',
            title: t('actionsidebar.Purchase Failed'),
            description: t('actionsidebar.Unknown Error'),
          })
        }
      } else {
        toast({
          variant: 'destructive',
          title: t('actionsidebar.Unknown Error'),
          description: t('actionsidebar.Try Again Later'),
        })
      }
    } finally {
      setBuying(false)
    }
  }

  
  const getSuccessRate = (countryName: string, serviceName: string) => {
    const key = `${countryName.toLowerCase()}_${serviceName.toLowerCase()}`;
    
    // Check if the value is already stored in localStorage
    const storedSuccessRate = localStorage.getItem(key);
    if (storedSuccessRate) {
        return parseFloat(storedSuccessRate); // Return the stored value
    }

    // If not in localStorage, calculate and store the value
    const stats = statistics[key];
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


  return (
    <div className="flex flex-col w-full max-w-md mx-auto p-4 space-y-4 bg-background rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl pl-6 text-blue-600 font-bold">{t('actionsidebar.title')}</h1>
        <Button
          variant="outline"
          className='text-blue-600'
          size="icon"
          onClick={() => setServiceFirst(!serviceFirst)}
          title={serviceFirst ? t('actionsidebar.Switch To Country First') : t('actionsidebar.Switch To Service First')}
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>

      {serviceFirst ? (
        <>
          <ServiceSelector
             order="1"
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            services={filteredServices}
            serviceSearch={serviceSearch}
            setServiceSearch={setServiceSearch}
            loadingServices={loadingServices}
            errorLoadingServices={errorLoadingServices}
            fetchServices={fetchServices}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            showMore={showMore}
            setShowMore={setShowMore}
            selectedCountry={selectedCountry}
            getServicePrice={getServicePrice}
            allPricingData={allPricingData}
            getSuccessRate={(serviceName) => selectedCountry ? getSuccessRate(selectedCountry.name, serviceName) : null}
          />
          <CountrySelector
          order={"2"}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={filteredCountries}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
            loadingCountries={loadingCountries}
            errorLoadingCountries={errorLoadingCountries}
            fetchCountries={fetchCountries}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            getSuccessRate={(countryName) => selectedService ? getSuccessRate(countryName, selectedService.name) : null}
          />
        </>
      ) : (
        <>
          <CountrySelector
          order = {"1"}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            countries={filteredCountries}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
            loadingCountries={loadingCountries}
            errorLoadingCountries={errorLoadingCountries}
            fetchCountries={fetchCountries}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            getSuccessRate={(countryName) => selectedService ? getSuccessRate(countryName, selectedService.name) : null}
          />
          <ServiceSelector
          order={"2"}
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            services={filteredServices}
            serviceSearch={serviceSearch}
            setServiceSearch={setServiceSearch}
            loadingServices={loadingServices}
            errorLoadingServices={errorLoadingServices}
            fetchServices={fetchServices}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            showMore={showMore}
            setShowMore={setShowMore}
            selectedCountry={selectedCountry}
            getServicePrice={getServicePrice}
            allPricingData={allPricingData}
            getSuccessRate={(serviceName) => selectedCountry ? getSuccessRate(selectedCountry.name, serviceName) : null}
          />
        </>
      )}

      <Button
        onClick={buyProduct}
        className="w-full text-white"
        disabled={!selectedCountry || !selectedService || buying}
      >
        {buying ? (
          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {t('actionsidebar.Buy number')}
        
      </Button>
    </div>
  )
}