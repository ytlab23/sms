
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scrollarea';
import { RefreshCcw, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from './ui/toast';
import { toast } from './ui/use-toast';
import Loader2 from '../../common/loader2';
import { CountrySelector } from './buy-service/country-selector';
import { ServiceSelector } from './buy-service/service-selector';
import { SelectedTile } from './buy-service/SelectedTile';
import { Country, Service, Operator } from './buy-service/types';
import { fetchAllPricing, getServicePrice } from './buy-service/utils';
import { useTranslation } from 'react-i18next';

export const ChooseService: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);

  const [countrySearch, setCountrySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
  }>(() => {
    const storedFavorites = localStorage.getItem('favorites');
    return storedFavorites ? JSON.parse(storedFavorites) : { countries: {}, services: {} };
  });

  const [showMore, setShowMore] = useState(false);
  const [allPricingData, setAllPricingData] = useState<{ [key: string]: number | null }>({});
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorLoadingCountries, setErrorLoadingCountries] = useState(false);
  const [errorLoadingServices, setErrorLoadingServices] = useState(false);
  const [failedToBuy, setFailedToBuy] = useState(false);
  const [buying, setBuying] = useState(false);
  const {t} = useTranslation();

  useEffect(() => {
    fetchCountries();
    fetchServices();
    fetchAllPricing().then(setAllPricingData).finally(() => setLoadingPricing(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const countriesCollectionRef = collection(db, 'countries');
      const q = query(countriesCollectionRef, where('included', '==', true));
      const querySnapshot = await getDocs(q);
      const formattedCountries = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        iso: doc.data().iso,
        prefix: doc.data().prefix,
      }));
      setCountries(formattedCountries);
      setFilteredCountries(formattedCountries);
    } catch (error) {
      setErrorLoadingCountries(true);
    } finally {
      setLoadingCountries(false);
    }
  };

  const fetchServices = async () => {
    setLoadingServices(true);
    try {
      const servicesCollectionRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesCollectionRef);
      const formattedServices = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        category: doc.data().category,
        quantity: doc.data().quantity,
        price: doc.data().price,
        main: doc.data().main || false,
        isIncluded: doc.data().isIncluded || false,
      }));
      setServices(formattedServices);
      setFilteredServices(formattedServices);
    } catch (error) {
      setErrorLoadingServices(true);
    } finally {
      setLoadingServices(false);
    }
  };

  const buyProduct = async () => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to purchase a product.',
        action: (
          <ToastAction onClick={() => navigate('/auth/signin')} altText="Go to login">
            {t('actionsidebar.Go to Login')}
          </ToastAction>
        ),
      });
      return;
    }

    setBuying(true);
    setFailedToBuy(false);
    const country = selectedCountry?.name.toLowerCase();
    const product = selectedService?.name.toLowerCase();

    try {
      const response = await axios.post('https://smsverify-server.vercel.app/api/buy-product', {
        uid: currentUser.uid,
        country,
        product,
      });

      const id = response.data?.product?.id ?? null;

      setSelectedCountry(null);
      setSelectedService(null);
      setSelectedOperator(null);

      toast({
        variant: 'success',
        title: 'Product purchased successfully',
        description: 'You can now use the service. Refresh page to see the changes.',
      });
      navigate(`/sms?id=${id}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title: 'Insufficient balance',
            description: 'Please top up your account to complete the purchase.',
            action: (
              <ToastAction onClick={() => navigate('/pay')} altText="Go to payment">
               {t('actionsidebar.Go to Payment')} 
              </ToastAction>
            ),
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Purchase failed',
            description: 'Something went wrong while purchasing the product.',
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Unknown error',
          description: 'An unknown error occurred. Please try again.',
          action: (
            <ToastAction onClick={buyProduct} altText="Try again">
               {t('actionsidebar.Try again')} 
            </ToastAction>
          ),
        });
      }
      setFailedToBuy(true);
    } finally {
      setBuying(false);
    }
  };

  const toggleFavorite = (type: 'countries' | 'services', id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));
  };

  return (
    <div className="flex dark:bg-boxdark-2 min-w-full rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
      <CountrySelector
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
      />

      <ServiceSelector
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
        getServicePrice={(serviceName, countryName) => getServicePrice(serviceName, countryName, allPricingData)}
        allPricingData={allPricingData}
      />

      <div className="p-4">
        {buying && !failedToBuy && <Loader2 height="20px" />}
        {!buying && (
          <Button
            onClick={buyProduct}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2"
            disabled={!selectedCountry || !selectedService}
          ><ShoppingCart className="w-5 h-5" />
            {failedToBuy && !buying && <span>{t('actionsidebar.Retry')}</span>}
            {!failedToBuy && !buying && <span>{t('actionsidebar.Buy number')}</span>}
          </Button>



          
        )}
      </div>
    </div>
  );
};
