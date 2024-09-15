import { useState, useMemo, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scrollarea';
import { Search, Star, X } from 'lucide-react';
import Logo from '../../images/logo/logo-placeholder.svg';
import axios from 'axios';
import { useAuth } from '../../contexts/authcontext';
import { count } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { ToastAction } from './ui/toast';
import { toast } from './ui/use-toast';

interface Country {
  iso: string;
  name: string;
  prefix: string;
}

interface Service {
  name: string;
  icon: string;
}

interface Operator {
  name: string;
  cost: number;
  count: number;
}

interface SelectedTileProps {
  item: Country | Service | Operator;
  onCancel: () => void;
  type: 'country' | 'service' | 'operator';
}

// const countriesData: Record<string, Country> = {
//   ca: {
//     name: "Canada",
//     flag: "ca",
//     services: ["whatsapp", "telegram", "facebook"],
//     operators: [
//       { id: "bell", name: "Bell", price: 2.5, count: 1000 },
//       { id: "rogers", name: "Rogers", price: 2.7, count: 800 },
//       { id: "telus", name: "Telus", price: 2.3, count: 1200 },
//     ],
//   },
//   gb: {
//     name: "England",
//     flag: "gb",
//     services: ["whatsapp", "telegram", "instagram"],
//     operators: [
//       { id: "vodafone", name: "Vodafone", price: 3.0, count: 1500 },
//       { id: "ee", name: "EE", price: 3.2, count: 1300 },
//       { id: "o2", name: "O2", price: 2.8, count: 1100 },
//     ],
//   },
//   us: {
//     name: "USA",
//     flag: "us",
//     services: ["facebook", "google", "amazon"],
//     operators: [
//       { id: "att", name: "AT&T", price: 2.0, count: 2000 },
//       { id: "verizon", name: "Verizon", price: 2.2, count: 1800 },
//       { id: "tmobile", name: "T-Mobile", price: 1.8, count: 2200 },
//     ],
//   },
// };

const servicesData: Record<string, Service> = {
  whatsapp: { name: 'WhatsApp', icon: 'whatsapp' },
  telegram: { name: 'Telegram', icon: 'telegram' },
  facebook: { name: 'Facebook', icon: 'facebook' },
  instagram: { name: 'Instagram', icon: 'instagram' },
  google: { name: 'Google', icon: 'google' },
  amazon: { name: 'Amazon', icon: 'amazon' },
};

const SelectedTile: React.FC<SelectedTileProps> = ({
  item,
  onCancel,
  type,
}) => (
  <div className="flex items-center dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-between bg-gray-100 p-2 rounded-md">
    <div className="flex items-center">
      <img
        src={`https://logo.clearbit.com/${item.name.toLowerCase()}.com`}
        alt={
          type === 'country' ? `Flag of ${item.name}` : `Icon of ${item.name}`
        }
        className={
          type === 'country'
            ? `flags flags-${item as Country}`
            : `products products-${(item as Service).icon}`
        }
        width={20}
        height={20}
      />
      <span className="ml-2">{item.name}</span>
    </div>
    <Button variant="ghost" size="sm" onClick={onCancel}>
      <X className="h-4 w-4" />
    </Button>
  </div>
);

export const ChooseService: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [countries, setCountries] = useState<
    { name: string; iso: string; prefix: string }[]
  >([]);
  const [services, setServices] = useState<any[]>([]);
  // create a state for filtered countries and services
  const [filteredCountries, setFilteredCountries] = useState<
    { name: string; iso: string; prefix: string }[]
  >([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);

  const [countrySearch, setCountrySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(
    null,
  );
  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
    operators: Record<string, boolean>;
  }>({
    countries: {},
    services: {},
    operators: {},
  });
  useEffect(() => {
    fetchCountries();
    fetchServices();
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;
    fetchServices();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedService) return;
    fetchOperator();
  }, [selectedCountry, selectedService]);

  // const countries = Object.values(countriesData);
  // const services = Object.values(servicesData);
  const fetchCountries = async () => {
    console.log('fetching countries');
    fetch('https://smsverify-server.vercel.app/api/countries', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedCountries = Object.entries(data).map(
          ([key, value]: [string, any]) => ({
            name: value.text_en, // English name of the country
            iso: Object.keys(value.iso)[0], // ISO code, e.g., 'af' for Afghanistan
            prefix: Object.keys(value.prefix)[0], // Prefix, e.g., '+93' for Afghanistan
          }),
        );
        setCountries(formattedCountries);
        console.log('Formatted Countries:', formattedCountries);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  };

  // Fetch services
  // Fetch services
  // const buyProduct = async () => {
  //   console.log('buying prgggoduct');
  //   const country = selectedCountry?.name.toLowerCase();
  //   const product = selectedService?.name.toLowerCase();
  //   const operator = selectedOperator?.name.toLowerCase();
  //   console.log(``, 'buying product', country, product, operator);

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:3000/api/buy-product',
  //       {
  //         uid: currentUser?.uid,
  //         country: country,
  //         operator: operator,
  //         product: product,
  //       },
  //     );
  //     const id = response.data?.product.id ?? null;
  //     // alert(id);
  //     // alert('Product purchased successfully');
  //     setSelectedCountry(null);
  //     setSelectedService(null);
  //     setSelectedOperator(null);
  //     // how to show shadcn 
  //     navigate(`/sms?id=${id}`);
  //     toast({ 
  //       variant: "success",
  //       title: "Product purchased successfully",
  //       description: "You can now use the service.",
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     alert('Failed to purchase product');
  //     console.error(error);
  //     if (error instanceof Error) {
  //       alert(error);
  //     } else {
  //       alert('An unknown error occurred.');
  //     }
  //     toast({
  //       variant: "destructive",
  //       title: "Uh oh! Something went wrong.",
  //       description: "Failed to purchase product",
  //       action: <ToastAction onClick={buyProduct} altText="Try again">Try again</ToastAction>,
  //     });
     
  //   }
  // };
  const buyProduct = async () => {
    console.log('buying product');
    const country = selectedCountry?.name.toLowerCase();
    const product = selectedService?.name.toLowerCase();
    const operator = selectedOperator?.name.toLowerCase();
  
    console.log('buying product', country, product, operator);
  
    try {
      const response = await axios.post('https://smsverify-server.vercel.app/api/buy-product', {
        uid: currentUser?.uid,
        country,
        operator,
        product,
      });
  
      const id = response.data?.product?.id ?? null;
  
      // Reset the selected states
      setSelectedCountry(null);
      setSelectedService(null);
      setSelectedOperator(null);
  
      // Navigate to the SMS page
      navigate(`/sms?id=${id}`);
  
      // Success toast notification
      // toast({
      //   variant: 'success',
      //   title: 'Product purchased successfully',
      //   description: 'You can now use the service.',
      // });
  
      // console.log('Purchase response:', response.data);
    } catch (error: any) {
      // Handle different error types
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          // Insufficient balance toast
          toast({
            variant: 'destructive',
            title: 'Insufficient balance',
            description: 'Please top up your account to complete the purchase.',
            action: <ToastAction onClick={() => navigate('/pay')} altText="Go to payment">Go to Payment</ToastAction>,
          });
        } else {
          // General Axios error
          toast({
            variant: 'destructive',
            title: 'Purchase failed',
            description:  'Something went wrong while purchasing the product.',
          });
        }
      } else {
        // Non-Axios or unknown errors
        toast({
          variant: 'destructive',
          title: 'Unknown error',
          description: 'An unknown error occurred. Please try again.',
          action: <ToastAction onClick={buyProduct} altText="Try again">Try again</ToastAction>,
        });
      }
  
      console.error('Error purchasing product:', error);
    }
  };
  const fetchServices = async () => {
    console.log('fetching services');

    try {
      let lowercaseCountry = 'any';
      if (selectedCountry) {
        lowercaseCountry = (selectedCountry?.name as string)?.toLowerCase();
      }
      console.log(
        ' services',
        lowercaseCountry,
      );
      const response = await axios.get(
        `https://smsverify-server.vercel.app/api/get-services?country=${lowercaseCountry}`,
      );

      const formattedServices = Object.entries(response.data).map(
        ([key, value]: [string, any]) => ({
          name: key, // Service name like '115com'
          category: (value as { Category: string }).Category, // Service category
          quantity: (value as { Qty: number }).Qty, // Available quantity
          price: (value as { Price: number }).Price, // Service price
        }),
      );
      setServices(formattedServices);
      console.log('Formatted Services:', formattedServices);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const fetchOperator = async () => {
    const lowercaseCountry = (selectedCountry?.name as string).toLowerCase();
    const lowercaseService = (selectedService?.name as string).toLowerCase();
    console.log(
      'operators,, are coming',
      selectedCountry?.name,
      selectedService?.name,
    );
    try {
      const response = await fetch(
        `https://smsverify-server.vercel.app/api/get-operators?country=${lowercaseCountry}&service=${lowercaseService}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch operators.');
      }

      const data = await response.json();
      console.log('response data', data);

      // Format operators to an array from the nested object structure
      const formattedOperators = Object.entries(
        data[lowercaseCountry][lowercaseService],
      ).map(([name, details]: [string, any]) => ({
        name, // e.g., 'beeline', 'matrix', etc.
        cost: details.cost,
        count: details.count,
        rate: details.rate ?? 0, // Make rate optional with a default value of 0
      }));

      setOperators(formattedOperators);
    } catch (err: any) {
      console.log(err.message);
    } finally {
      // Optionally handle loading state
    }
  };

  useEffect(() => {
    setFilteredCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()),
      ),
    );
  }, [countries, countrySearch]);

  useEffect(() => {
    setFilteredServices(
      services.filter((service) =>
        service.name.toLowerCase().includes(serviceSearch.toLowerCase()),
      ),
    );
  }, [services, serviceSearch]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedOperator(null);
    setCountrySearch('');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedOperator(null);
    setServiceSearch('');
  };

  const handleOperatorSelect = (operator: Operator) => {
    setSelectedOperator(operator);
    setOperatorSearch('');
  };

  const handleCountryCancel = () => {
    setSelectedCountry(null);
    setSelectedOperator(null);
    setCountrySearch('');
    setOperatorSearch('');
  };

  const handleServiceCancel = () => {
    setSelectedService(null);
    setSelectedOperator(null);
    setServiceSearch('');
    setOperatorSearch('');
  };

  const handleOperatorCancel = () => {
    setSelectedOperator(null);
    setOperatorSearch('');
  };

  const toggleFavorite = (
    type: 'countries' | 'services' | 'operators',
    id: string,
  ) => {
    setFavorites((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [id]: !prev[type][id],
      },
    }));
  };

  return (
    <div className="flex dark:bg-boxdark-2  rounded-lg dark:shadow-5 shadow-[#3a3838] flex-col w-120 bg-whiten p-4">
      <div className="p-4 ">
        <h2 className="text-lg font-semibold mb-4">1. Select country</h2>
        {selectedCountry ? (
          <SelectedTile
            item={selectedCountry}
            onCancel={handleCountryCancel}
            type="country"
          />
        ) : (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark" />
            <Input
              placeholder="Find country"
              className="pl-8 dark:bg-boxdark"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
          </div>
        )}
      </div>
      {!selectedCountry && (
        <div className="h-[300px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {filteredCountries.map((country, index) => (
                <Button
                  key={`${country.iso}-${index}`}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.countries[country.name]
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('countries', country.name);
                      }}
                    />
                    {/* <img
                      src={Logo}
                      alt={`Flag of ${country.name}`}
                      className={`flags flags-${country.iso} mr-2`}
                      width={20}
                      height={20}
                    /> */}
                    <img
                      src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`} // Using the ISO code
                      alt={`Flag of ${country.name}`}
                      className={`flags flags-${country.iso} mr-2`}
                      width={20}
                      height={20}
                    />

                    <span>{country.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <div className="p-4 ">
        <h2 className="text-lg font-semibold mb-4">2. Select service</h2>
        {selectedService ? (
          <SelectedTile
            item={selectedService}
            onCancel={handleServiceCancel}
            type="service"
          />
        ) : (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Find website or app"
              className="pl-8 dark:bg-boxdark"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
            />
          </div>
        )}
      </div>
      {!selectedService && (
        <div className="h-[300px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {filteredServices.map((service, index) => (
                
                <Button
                  key={`${service.name}-${index}`}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.services[service.icon]
                          ? 'text-yellow-400 '
                          : 'text-gray-400'
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('services', service.icon);
                      }}
                    />
                    {/* <img
                      src={Logo}
                      alt={`Icon of ${service.name}`}
                      className={`products products-${service.icon} mr-2`}
                      width={20}
                      height={20}
                    /> */}
                    <img
                      src={`https://logo.clearbit.com/${service.name.toLowerCase()}.com`}
                      alt={`Icon of ${service.name}`}
                      className="mr-2"
                      width={20}
                      height={20}
                      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                        (e.target as HTMLImageElement).onerror = null; // Prevent infinite loop
                        (e.target as HTMLImageElement).src = ''; // Remove broken image
                        (e.target as HTMLImageElement).replaceWith(document.createTextNode('')); // Replace with "?" fallback
                      }}
                    />
                    <div className="flex flex-row justify-end">
                      <span className="mr-6">{service.name}</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-blue-300">
                          {service.quantity} Available number{' '}
                        </span>

                        <span className="text-xs text-blue-950">
                          price from {service.price}{' '}
                        </span>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <div className="p-4 ">
        <h2 className="text-lg font-semibold mb-4">3. Select operator</h2>
        {selectedOperator ? (
          <SelectedTile
            item={selectedOperator}
            onCancel={handleOperatorCancel}
            type="operator"
          />
        ) : selectedCountry && selectedService ? (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Find operator"
              className="pl-8 dark:bg-boxdark"
              value={operatorSearch}
              onChange={(e) => setOperatorSearch(e.target.value)}
            />
          </div>
        ) : (
          <div className="bg-white  dark:bg-boxdark border-blue-20 rounded p-4 ">
            Select country and service first
          </div>
        )}
      </div>
      {selectedCountry && selectedService && !selectedOperator && (
        <div className="h-[200px] overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {operators.map((operator, index) => (
                <Button
                  key={`${operator.name}-${index}`}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleOperatorSelect(operator)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.operators[operator.name]
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite('operators', operator.name);
                      }}
                    />
                    <span className="flex-grow">{operator.name}</span>
                    <div className="text-right">
                      <div className="text-sm">from {operator.cost}₽</div>
                      <div className="text-xs text-green-500">
                        {operator.count} numbers
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      <div className="p-4">
        <Button
          onClick={buyProduct}
          className="w-full text-white"
          disabled={!selectedCountry || !selectedService || !selectedOperator}
        >
          Buy number
        </Button>
      </div>
    </div>
  );
};
