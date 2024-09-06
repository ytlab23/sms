import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scrollarea";
import { Search, Star, X } from "lucide-react";
import Logo from '../../images/logo/logo-placeholder.svg';

interface Country {
  id?: string;
  name: string;
  flag: string;
  services: string[];
  operators: Operator[];
}

interface Service {
  name: string;
  icon: string;
}

interface Operator {
  id: string;
  name: string;
  price: number;
  count: number;
}

interface SelectedTileProps {
  item: Country | Service | Operator;
  onCancel: () => void;
  type: "country" | "service" | "operator";
}

const countriesData: Record<string, Country> = {
  ca: {
    name: "Canada",
    flag: "ca",
    services: ["whatsapp", "telegram", "facebook"],
    operators: [
      { id: "bell", name: "Bell", price: 2.5, count: 1000 },
      { id: "rogers", name: "Rogers", price: 2.7, count: 800 },
      { id: "telus", name: "Telus", price: 2.3, count: 1200 },
    ],
  },
  gb: {
    name: "England",
    flag: "gb",
    services: ["whatsapp", "telegram", "instagram"],
    operators: [
      { id: "vodafone", name: "Vodafone", price: 3.0, count: 1500 },
      { id: "ee", name: "EE", price: 3.2, count: 1300 },
      { id: "o2", name: "O2", price: 2.8, count: 1100 },
    ],
  },
  us: {
    name: "USA",
    flag: "us",
    services: ["facebook", "google", "amazon"],
    operators: [
      { id: "att", name: "AT&T", price: 2.0, count: 2000 },
      { id: "verizon", name: "Verizon", price: 2.2, count: 1800 },
      { id: "tmobile", name: "T-Mobile", price: 1.8, count: 2200 },
    ],
  },
};

const servicesData: Record<string, Service> = {
  whatsapp: { name: "WhatsApp", icon: "whatsapp" },
  telegram: { name: "Telegram", icon: "telegram" },
  facebook: { name: "Facebook", icon: "facebook" },
  instagram: { name: "Instagram", icon: "instagram" },
  google: { name: "Google", icon: "google" },
  amazon: { name: "Amazon", icon: "amazon" },
};

const SelectedTile: React.FC<SelectedTileProps> = ({ item, onCancel, type }) => (
  <div className="flex items-center dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-between bg-gray-100 p-2 rounded-md">
    <div className="flex items-center">
      <img
        src={Logo}
        alt={type === "country" ? `Flag of ${item.name}` : `Icon of ${item.name}`}
        className={type === "country" ? `flags flags-${(item as Country).flag}` : `products products-${(item as Service).icon}`}
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
  
  const [countrySearch, setCountrySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [operatorSearch, setOperatorSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [favorites, setFavorites] = useState<{
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
    operators: Record<string, boolean>;
  }>({
    countries: {},
    services: {},
    operators: {},
  });

  const countries = Object.values(countriesData);
  const services = Object.values(servicesData);

  const filteredCountries = useMemo(() => {
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) &&
        (!selectedService || country.services.includes(selectedService.icon))
    );
  }, [countrySearch, selectedService]);

  const filteredServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(serviceSearch.toLowerCase()) &&
        (!selectedCountry || selectedCountry.services.includes(service.icon))
    );
  }, [serviceSearch, selectedCountry]);

  const filteredOperators = useMemo(() => {
    if (!selectedCountry) return [];
    return selectedCountry.operators.filter((operator) =>
      operator.name.toLowerCase().includes(operatorSearch.toLowerCase())
    );
  }, [selectedCountry, operatorSearch]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSelectedOperator(null);
    setCountrySearch("");
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedOperator(null);
    setServiceSearch("");
  };

  const handleOperatorSelect = (operator: Operator) => {
    setSelectedOperator(operator);
    setOperatorSearch("");
  };

  const handleCountryCancel = () => {
    setSelectedCountry(null);
    setSelectedOperator(null);
    setCountrySearch("");
    setOperatorSearch("");
  };

  const handleServiceCancel = () => {
    setSelectedService(null);
    setSelectedOperator(null);
    setServiceSearch("");
    setOperatorSearch("");
  };

  const handleOperatorCancel = () => {
    setSelectedOperator(null);
    setOperatorSearch("");
  };

  const toggleFavorite = (type: "countries" | "services" | "operators", id: string) => {
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
          <SelectedTile item={selectedCountry} onCancel={handleCountryCancel} type="country" />
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
              {filteredCountries.map((country) => (
                <Button
                  key={country.flag}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleCountrySelect(country)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.countries[country.flag] ? "text-yellow-400" : "text-gray-400"
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("countries", country.flag);
                      }}
                    />
                    <img
                      src={Logo}
                      alt={`Flag of ${country.name}`}
                      className={`flags flags-${country.flag} mr-2`}
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
          <SelectedTile item={selectedService} onCancel={handleServiceCancel} type="service" />
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
              {filteredServices.map((service) => (
                <Button
                  key={service.icon}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.services[service.icon] ? "text-yellow-400 " : "text-gray-400"
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("services", service.icon);
                      }}
                    />
                    <img
                      src={Logo}
                      alt={`Icon of ${service.name}`}
                      className={`products products-${service.icon} mr-2`}
                      width={20}
                      height={20}
                    />
                    <span className="">{service.name}</span>
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
          <SelectedTile item={selectedOperator} onCancel={handleOperatorCancel} type="operator" />
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
              {filteredOperators.map((operator) => (
                <Button
                  key={operator.id}
                  variant="ghost"
                  className="w-full dark:bg-boxdark bg-white transition-transform hover:scale-105 duration-300 ease-in-out justify-start font-normal h-14"
                  onClick={() => handleOperatorSelect(operator)}
                >
                  <div className="flex items-center w-full">
                    <Star
                      className={`h-5 w-5 mr-2 ${
                        favorites.operators[operator.id] ? "text-yellow-400" : "text-gray-400"
                      } cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite("operators", operator.id);
                      }}
                    />
                    <span className="flex-grow">{operator.name}</span>
                    <div className="text-right">
                      <div className="text-sm">from {operator.price}₽</div>
                      <div className="text-xs text-green-500">
                        {operator.count.toLocaleString()} numbers
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
          className="w-full text-white"
          disabled={!selectedCountry || !selectedService || !selectedOperator}
        >
          Buy number
        </Button>
      </div>
    </div>
  );
};
