
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

  useEffect(() => {
    fetchCountriesFromFirestore();
    fetchServicesFromFirestore();
  }, []);

  // Fetch countries with included status
  const fetchCountriesFromFirestore = async () => {
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
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Fetch common services from Firestore
  const fetchServicesFromFirestore = async () => {
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
    } catch (error) {
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
        <h3 className="font-bold">1. Add New Country</h3>
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
              <TableHead>Current Price ($)</TableHead>
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
        </Table>  

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

