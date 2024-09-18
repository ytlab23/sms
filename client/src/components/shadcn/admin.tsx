
import React, { useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"; // Firestore imports
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { ScrollArea } from './ui/scrollarea'
import { Checkbox } from "./ui/checkbox"
import { db } from '../../firebase/config';
import Loader2 from '../../common/loader2';
import { RefreshCcw } from 'lucide-react';
import axios from 'axios';

type Service = {
  name: string;
  price: number;
  previousPrice: number;
  isFavorite?: boolean;
};

export default function Admin() {
  const [data, setData] = useState<any[]>([]) // To store included countries and their services
  const [services, setServices] = useState<Service[]>([]) // To store common services
  const [candidateCountries, setCandidateCountries] = useState<string[]>([]) // To store countries not yet included
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({})
  const [selectedCountry, setSelectedCountry] = useState('')
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ country: '', service: '', oldPrice: 0, newPrice: 0 })
  const [countryToRemove, setCountryToRemove] = useState('')
  const [loadingCountry, setLoadingCountry] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [errorLoadingCountry, setErrorLoadingCountry] = useState(false)
  const [errorLoadingService, setErrorLoadingService] = useState(false)






  const [oldCountries, setOldCountries] = useState<
  { name: string; iso: string; prefix: string }[]
>([]);
const [oldServices, setOldServices] = useState<any[]>([]);

  useEffect(() => {
    fetchCountriesFromFirestore();
    fetchServicesFromFirestore();
  }, []);



  const fetOldchCountries = async () => {
    console.log('Checking if countries collection exists...');
  
    try {
      // Step 1: Check if the countries collection exists
      const countriesCollectionRef = collection(db, 'countries');
      const querySnapshot = await getDocs(countriesCollectionRef);
  
      if (!querySnapshot.empty) {
        console.log('Countries collection already exists, skipping fetch.');
        return; // Exit if the collection exists
      }
  
      // Step 2: Fetch countries from external API if collection doesn't exist
      console.log('Countries collection not found, fetching from API...');
      const response = await fetch('http://localhost:3000/api/countries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch countries from API');
      }
  
      const data = await response.json();
  
      // Step 3: Format the countries data
      const formattedCountries = Object.entries(data).map(
        ([key, value]: [string, any]) => ({
          name: value.text_en, // English name of the country
          iso: Object.keys(value.iso)[0], // ISO code, e.g., 'af' for Afghanistan
          prefix: Object.keys(value.prefix)[0], // Prefix, e.g., '+93' for Afghanistan
        })
      );
  
      // Step 4: Save each formatted country to Firestore
      formattedCountries.forEach(async (country) => {
        try {
          const docRef = doc(countriesCollectionRef, country.name); // Use ISO code as the document ID
          await setDoc(docRef, {
            name: country.name,
            prefix: country.prefix,
            iso: country.iso,
            included: false, // Add any other fields as necessary
          });
          console.log(`Country ${country.name} saved successfully`);
        } catch (error) {
          console.error(`Error saving country ${country.name}:`, error);
        }
      });
  
      // Step 5: Update state with formatted countries (if needed)
      setOldCountries(formattedCountries);
      console.log('Formatted Countries:', formattedCountries);
      
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };
  const fetchOldServices = async () => {
    console.log('Checking if services collection exists...');
  
    try {
      // Step 1: Check if the services collection has any documents
      const servicesCollectionRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesCollectionRef);
  
      if (!servicesSnapshot.empty) {
        console.log('Services collection already exists, skipping API fetch.');
        return; // Exit if the services collection exists
      }
  
      // Step 2: Always fetch services for 'any' as the country parameter
      const lowercaseCountry = 'any'; // Always use 'any'
      console.log('Fetching services for country: any');
  
      const response = await axios.get(
        `http://localhost:3000/api/get-services?country=${lowercaseCountry}`,
      );
  
      const formattedServices = Object.entries(response.data).map(
        ([key, value]: [string, any]) => ({
          name: key, // Service name like '115com'
          category: (value as { Category: string }).Category, // Service category
          quantity: (value as { Qty: number }).Qty, // Available quantity
          price: 0.7, // Set default service price
          main: false, // Initially set to false
        })
      );
  
      // Step 3: Save each service to Firestore
      formattedServices.forEach(async (service) => {
        try {
          const serviceDocRef = doc(servicesCollectionRef, service.name);
          const docSnapshot = await getDoc(serviceDocRef);
  
          if (!docSnapshot.exists()) {
            // Service doesn't exist, set 'main' to false and save
            await setDoc(serviceDocRef, {
              name: service.name,
              category: service.category,
              quantity: service.quantity,
              price: service.price,
              country: lowercaseCountry, // Store the country context ('any')
              main: false, // Set main to false initially
            });
            console.log(`Service ${service.name} saved successfully with main: false`);
          } else {
            // If service already exists, use the existing value of 'main'
            const existingService = docSnapshot.data();
            service.main = existingService?.main || false; // Use the saved 'main' value
            console.log(`Service ${service.name} already exists, main: ${service.main}`);
          }
        } catch (error) {
          console.error(`Error saving service ${service.name}:`, error);
        }
      });
  
      setOldServices(formattedServices); // Set state with formatted services
      console.log('Formatted Services:', formattedServices);
  
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  // Fetch countries with included status
  const fetchCountriesFromFirestore = async () => {
    fetOldchCountries();
    setLoadingCountry(true); // Set loading country status
    try {
      const countriesSnapshot = await getDocs(collection(db, 'countries'));
      const includedCountries: any[] = [];
      const candidateCountries: string[] = [];

      countriesSnapshot.forEach(doc => {
        const countryData = doc.data();
        if (countryData.included) {
          includedCountries.push({ country: countryData.name, services: services });
        } else {
          candidateCountries.push(countryData.name);
        }
      });

      setData(includedCountries); // Set table data
      setCandidateCountries(candidateCountries); // Set candidate countries for selection
      setLoadingCountry(false); // Set country loaded status
    } catch (error) {
      setErrorLoadingCountry(true); // Set error loading country status
      setLoadingCountry(false); // Set country loaded status
      console.error('Error fetching countries:', error);
    }
  };

  // Fetch common services from Firestore
  const fetchServicesFromFirestore = async () => {
    fetchOldServices();
    setLoadingServices(true); // Set loading service status
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const fetchedServices: Service[] = [];

      servicesSnapshot.forEach(doc => {
        const serviceData = doc.data();
        fetchedServices.push({
          name: serviceData.name,
          price: serviceData.price,
          previousPrice: serviceData.price, // Assuming initial price is the previous price
          isFavorite: serviceData.main || false, // Check if it's marked as main
        });
      });

      setServices(fetchedServices); // Set common services
      setLoadingServices(false); // Set service loaded status
    } catch (error) {
      setErrorLoadingService(true); // Set error loading service status
      setLoadingServices(false); // Set service loaded status
      console.error('Error fetching services:', error);
    }
  };

  // Handle service change
  const handleServiceChange = (country: string, serviceName: string) => {
    setSelectedServices(prev => ({ ...prev, [country]: serviceName }));
  };

  // Add country to Firestore and update state
  const handleAddCountry = async () => {
    if (selectedCountry) {
      try {
        const countryDocRef = doc(db, 'countries', selectedCountry);
        await updateDoc(countryDocRef, { included: true });

        setData(prevData => [...prevData, { country: selectedCountry, services }]); // Add to table
        setCandidateCountries(prev => prev.filter(country => country !== selectedCountry)); // Remove from candidates
        setSelectedCountry('');
      } catch (error) {
        console.error('Error adding country:', error);
      }
    }
  };

  // Remove country (set included to false)
  const confirmRemoveCountry = async () => {
    try {
      const countryDocRef = doc(db, 'countries', countryToRemove);
      await updateDoc(countryDocRef, { included: false });

      setData(data.filter(item => item.country !== countryToRemove)); // Remove from table
      setCandidateCountries(prev => [...prev, countryToRemove]); // Add back to candidates
      setIsRemoveDialogOpen(false); // Close dialog
    } catch (error) {
      console.error('Error removing country:', error);
    }
  };

 
const confirmUpdatePrice = async () => {
  try {
    const { country, service, newPrice } = dialogContent;
    const countryLowerCase = country.toLowerCase();

    // Generate the document ID by concatenating country and service
    const serviceDocId = `${countryLowerCase}_${service}`;  // Using underscore to separate values
    const serviceDocRef = doc(db, 'pricing', serviceDocId);

    // Fetch the document from Firestore
    const docSnap = await getDoc(serviceDocRef);

    if (docSnap.exists()) {
      // If the document exists, update the price
      await updateDoc(serviceDocRef, { price: newPrice });
    } else {
      // If the document doesn't exist, create it with the new price
      await setDoc(serviceDocRef, { price: newPrice });
    }

    // Update the local state after Firestore operations succeed
    setData(data.map(item =>
      item.country === country
        ? {
            ...item,
            services: item.services.map((s: Service) =>
              s.name === service ? { ...s, previousPrice: newPrice } : s
            )
          }
        : item
    ));

    setIsPriceDialogOpen(false);  // Close the price dialog
  } catch (error) {
    // Enhanced error logging to help identify issues, like quota exceeded
    if (error instanceof Error) {
      console.error('Error updating service price:', error.message);
    } else {
      console.error('Error updating service price:', error);
    }
  }
};

  const handleFavoriteToggle = async (serviceName: string) => {
    const serviceDocRef = doc(db, 'services', serviceName);
    const updatedServices = services.map(service =>
      service.name === serviceName ? { ...service, isFavorite: !service.isFavorite } : service
    );

    setServices(updatedServices); // Update UI state
    await updateDoc(serviceDocRef, { main: !updatedServices.find(s => s.name === serviceName)?.isFavorite }); // Update Firestore
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>SMSVerify Pricing Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add country section */}
     { !loadingCountry && !loadingServices && !errorLoadingCountry && !errorLoadingService && ( <>  <h3 className="font-bold">1. Add New Country</h3>
        <div className="flex items-center mb-4">
          <Select onValueChange={setSelectedCountry} value={selectedCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {candidateCountries.map(country => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddCountry} className="ml-4 text-white">Add Country</Button>
        </div>
          {/* Services Table */}
        <h2>2.Edit details</h2>
        <Table>
          {/* Table Head */}
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Previous Price ($)</TableHead>
              <TableHead>Default Price(edit) ($)</TableHead>
              <TableHead>Update</TableHead>
              <TableHead>Remove</TableHead>
            </TableRow>
          </TableHeader>
          {/* Table Body */}
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.country}>
                <TableCell>{item.country}</TableCell>
                <TableCell>
                  <Select onValueChange={(value: string) => handleServiceChange(item.country, value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {services.map(service => (
                        <SelectItem key={service.name} value={service.name}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  {selectedServices[item.country] &&
                    item.services.find((s: Service) => s.name === selectedServices[item.country])?.previousPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  {selectedServices[item.country] && (
                    <Input
                      type="number"
                      value={item.services.find((s: Service) => s.name === selectedServices[item.country])?.price}
                      onChange={(e) =>
                        setDialogContent({
                          country: item.country,
                          service: selectedServices[item.country],
                          oldPrice: Number(e.target.value),
                          newPrice: Number(e.target.value),
                        })
                      }
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button className='text-white' onClick={() => setIsPriceDialogOpen(true)}>Update Price</Button>
                  {/* <Checkbox
                    checked={item.services.some((s: Service) => s.isFavorite)}
                    onCheckedChange={() => handleFavoriteToggle(selectedServices[item.country])}
                  /> */}
                  
                </TableCell>
                <TableCell>
                <Button className='bg-red-600 text-white' onClick={() => {
                    setCountryToRemove(item.country)
                    setIsRemoveDialogOpen(true)
                  }}>Remove Country</Button></TableCell>
              </TableRow>
            ))}
          </TableBody></Table>
        <h2>3. Update default pricing for service</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Main</TableHead>
              <TableHead>Previous Price ($)</TableHead>
              <TableHead>Update Price ($)</TableHead>
              <TableHead>Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.name}>
          <TableCell>{service.name}</TableCell>
          <TableCell>
            <Checkbox
              checked={service.isFavorite}
              onCheckedChange={() => handleFavoriteToggle(service.name)}
            />
          </TableCell>
          <TableCell>{service.price.toFixed(2)}</TableCell>
          <TableCell>
  <Input
    type="number"
    value={service.price}
    onChange={(e) =>
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.name === service.name
            ? { ...s, price: Number(e.target.value) }
            : s
        )
      )
    }
  />
</TableCell>
<TableCell>
  <Button className='text-white'
    onClick={async () => {
      try {
        const serviceDocRef = doc(db, 'services', service.name);
        await updateDoc(serviceDocRef, { price: service.price });
        alert('Service price updated successfully');
        console.log('Service price updated successfully');
      } catch (error) {
        console.error('Error updating service price:', error);
      }
    }}
  >
    Update
  </Button>
</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>  </>)}



        {loadingCountry && loadingCountry && <Loader2 height={'100px'}></Loader2>}
        {errorLoadingCountry && errorLoadingService  &&<div className="text-red-500 flex flex-row gap-2"><span>Error loading countries and Services. Refresh.</span> <RefreshCcw onClick={()=>{
          fetchCountriesFromFirestore();
          fetchServicesFromFirestore();
        }}></RefreshCcw></div>}
      

        {/* Price Dialog */}
        <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Update Service Price</DialogTitle>
              <DialogDescription>Update the price for a selected service.</DialogDescription>
            </DialogHeader>
            <Input
              type="number"
              value={dialogContent.newPrice}
              onChange={(e) => setDialogContent((prev) => ({ ...prev, newPrice: Number(e.target.value) }))}
            />
            <DialogFooter>
              <Button className='text-white' onClick={confirmUpdatePrice}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Country Dialog */}
        <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle >Remove Country</DialogTitle>
              <DialogDescription>Are you sure you want to remove this country?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button className='text-white' onClick={confirmRemoveCountry}>Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

