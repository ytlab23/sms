
import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
import { Input } from "./../ui/input";
import { Button } from "./../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./../ui/dialog";
import { useToast } from "./../ui/use-toast"

type Service = {
  name: string;
  price: number;
  isIncluded?: boolean;
};

type CountryData = {
  country: string;
  services: Record<string, number>;
};

type FreeService = {
  country: string;
  service: string;
};

export default function CountryServicePrices() {
  const [data, setData] = useState<CountryData[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({});
  const [newPrices, setNewPrices] = useState<Record<string, Record<string, number>>>({});
  const [freeService, setFreeService] = useState<FreeService | null>(null);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    country: '',
    service: '',
    oldPrice: 0,
    newPrice: 0,
  });
  const { toast } = useToast()

  useEffect(() => {
    fetchCountriesAndServices();
  }, []);

  const fetchCountriesAndServices = async () => {
    try {
      const countriesSnapshot = await getDocs(collection(db, 'countries'));
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const pricingSnapshot = await getDocs(collection(db, 'pricing'));
      const freeNumberSnapshot = await getDocs(collection(db, 'free_number'));
      
      const includedCountries: CountryData[] = [];
      const fetchedServices: Service[] = [];
      const pricing: Record<string, Record<string, number>> = {};
      let fetchedFreeService: FreeService | null = null;

      pricingSnapshot.forEach((doc) => {
        const [country, service] = doc.id.split('_');
        if (!pricing[country]) pricing[country] = {};
        pricing[country][service] = doc.data().price;
      });

      freeNumberSnapshot.forEach((doc) => {
        fetchedFreeService = doc.data() as FreeService;
      });

      countriesSnapshot.forEach((doc) => {
        const countryData = doc.data();
        if (countryData.included) {
          includedCountries.push({
            country: doc.id,
            services: pricing[doc.id.toLowerCase()] || {},
          });
        }
      });

      servicesSnapshot.forEach((doc) => {
        const serviceData = doc.data() as Service;
        if (serviceData.isIncluded) {
          fetchedServices.push(serviceData);
        }
      });

      setData(includedCountries);
      setServices(fetchedServices);
      setFreeService(fetchedFreeService);
      
      // Initialize newPrices state
      const initialNewPrices: Record<string, Record<string, number>> = {};
      includedCountries.forEach(country => {
        initialNewPrices[country.country] = { ...country.services };
      });
      setNewPrices(initialNewPrices);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleServiceChange = (country: string, serviceName: string) => {
    setSelectedServices((prev) => ({ ...prev, [country]: serviceName }));
  };

  const handlePriceChange = (country: string, service: string, price: number) => {
    setNewPrices(prev => ({
      ...prev,
      [country]: {
        ...prev[country],
        [service]: price
      }
    }));
  };

  const confirmUpdatePrice = async (country: string, service: string) => {
    try {
      const newPrice = newPrices[country][service];
      const countryLowerCase = country.toLowerCase();
      const serviceDocId = `${countryLowerCase}_${service}`;
      const serviceDocRef = doc(db, 'pricing', serviceDocId);

      await setDoc(serviceDocRef, { price: newPrice }, { merge: true });

      setData(
        data.map((item) =>
          item.country === country
            ? {
                ...item,
                services: { ...item.services, [service]: newPrice },
              }
            : item,
        ),
      );

      toast({
        title: "Success",
        description: `Price updated for ${service} in ${country}.`,
        variant: "success",
      })
    } catch (error) {
      console.error('Error updating service price:', error);
      toast({
        title: "Error",
        description: "Failed to update price. Please try again.",
        variant: "destructive",
      })
    }
  };

  const setNewFreeService = async (country: string, service: string) => {
    try {
      // Delete the existing free service
      if (freeService) {
        await deleteDoc(doc(db, 'free_number', freeService.country));
      }

      // Set the new free service
      const freeNumberDocRef = doc(db, 'free_number', country);
      await setDoc(freeNumberDocRef, { country, service });

      setFreeService({ country, service });

      toast({
        title: "Success",
        description: `${service} is now free for ${country}.`,
        variant: "success",
      })
    } catch (error) {
      console.error('Error setting free service:', error);
      toast({
        title: "Error",
        description: "Failed to set free service. Please try again.",
        variant: "destructive",
      })
    }
  };

  return (
    <div>
      {/* <h2 className="font-bold mb-4">2. Edit Country Service Prices</h2> */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Current Price ($)</TableHead>
            <TableHead>New Price ($)</TableHead>
            <TableHead>Update</TableHead>
            <TableHead>Free Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.country}>
              <TableCell>{item.country}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(value: string) =>
                    handleServiceChange(item.country, value)
                  }
                  value={selectedServices[item.country] || ''}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {services.map((service) => (
                      <SelectItem key={service.name} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {selectedServices[item.country] && item.services[selectedServices[item.country]]
                  ? item.services[selectedServices[item.country]].toFixed(2)
                  : '-'}
              </TableCell>
              <TableCell>
                {selectedServices[item.country] && (
                  <Input
                    type="number"
                    value={newPrices[item.country][selectedServices[item.country]] || ''}
                    onChange={(e) => handlePriceChange(item.country, selectedServices[item.country], Number(e.target.value))}
                  />
                )}
              </TableCell>
              <TableCell>
                <Button
                  className="text-white"
                  onClick={() => confirmUpdatePrice(item.country, selectedServices[item.country])}
                  disabled={!selectedServices[item.country]}
                >
                  Update Price
                </Button>
              </TableCell>
              <TableCell>
                {freeService && freeService.country === item.country ? (
                  <span>Current free: {freeService.service}</span>
                ) : (
                  <Button
                    className="text-white"
                    onClick={() => setNewFreeService(item.country, selectedServices[item.country])}
                    disabled={!selectedServices[item.country]}
                  >
                    Make Free
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {freeService && (
        <div className="mt-4">
          <h3 className="font-bold">Current Free Service:</h3>
          <p>{freeService.service} in {freeService.country}</p>
        </div>
      )}
    </div>
  );
}