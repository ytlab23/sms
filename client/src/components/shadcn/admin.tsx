
// import React, { useState } from 'react'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
// import { Input } from "./ui/input"
// import { Button } from "./ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
// import { Label } from "./ui/label"
// import { ScrollArea } from './ui/scrollarea'
// import { Checkbox } from "./ui/checkbox"

// const candidateCountries = ['Germany', 'Canada', 'Australia', 'France', 'Italy'] // List of countries to be added

// type Service = {
//   name: string;
//   price: number;
//   previousPrice: number;
//   isFavorite?: boolean; // Add the isFavorite property
// };

// const commonServices: Service[] = [
//   { name: 'WhatsApp', price: 0.5, previousPrice: 0.48 },
//   { name: 'Telegram', price: 0.45, previousPrice: 0.45 },
//   { name: 'SMS', price: 0.3, previousPrice: 0.28 },
// ];

// const initialData = [
//   { country: 'USA', services: commonServices },
//   { country: 'UK', services: commonServices },
// ]

// export default function Admin() {
//   const [data, setData] = useState(initialData)
//   const [selectedServices, setSelectedServices] = useState<Record<string, string>>({})
//   const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false)
//   const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)
//   const [dialogContent, setDialogContent] = useState({ country: '', service: '', oldPrice: 0, newPrice: 0 })
//   const [selectedCountry, setSelectedCountry] = useState('')
//   const [services, setServices] = useState(commonServices)
//   const [countryToRemove, setCountryToRemove] = useState('') 

//   const handleServiceChange = (country: string, serviceName: string) => {
//     setSelectedServices(prev => ({ ...prev, [country]: serviceName }))
//   }

//   const handlePriceChange = (country: string, serviceName: string, newPrice: number) => {
//     setData(data.map(item => 
//       item.country === country 
//         ? {
//             ...item,
//             services: item.services.map(s => 
//               s.name === serviceName ? { ...s, price: newPrice } : s
//             )
//           }
//         : item
//     ))
//   }

//   const handleUpdatePrice = (country: string) => {
//     const countryData = data.find(item => item.country === country)
//     const selectedService = selectedServices[country]
//     if (countryData && selectedService) {
//       const service = countryData.services.find(s => s.name === selectedService)
//       if (service) {
//         setDialogContent({
//           country,
//           service: service.name,
//           oldPrice: service.previousPrice,
//           newPrice: service.price
//         })
//         setIsPriceDialogOpen(true)
//       }
//     }
//   }

//   const confirmUpdatePrice = () => {
//     setData(data.map(item => 
//       item.country === dialogContent.country 
//         ? {
//             ...item,
//             services: item.services.map(s => 
//               s.name === dialogContent.service 
//                 ? { ...s, previousPrice: dialogContent.newPrice }
//                 : s
//             )
//           }
//         : item
//     ))
//     setIsPriceDialogOpen(false)
//   }

//   const handleAddCountry = () => {
//     if (selectedCountry) {
//       setData(prevData => [...prevData, { country: selectedCountry, services: commonServices }])
//       setSelectedCountry('')
//     }
//   }

//   const handleRemoveCountry = (country: string) => {
//     setCountryToRemove(country) // Store the country to be removed
//     setIsRemoveDialogOpen(true) // Open the confirmation dialog
//   }

//   const confirmRemoveCountry = () => {
//     setData(data.filter(item => item.country !== countryToRemove)) // Remove the country
//     setIsRemoveDialogOpen(false) // Close the dialog
//   }

//   const handleFavoriteToggle = (serviceName: string) => {
//     setServices(services.map(service => 
//       service.name === serviceName 
//         ? { ...service, isFavorite: !service.isFavorite }
//         : service
//     ))
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto bg-white">
//       <CardHeader>
//         <CardTitle>SMSVerify Pricing Admin Panel</CardTitle>
//       </CardHeader>
//       <CardContent>
//           <h3 className='font-bold'>Add New country </h3>
//         <div className="flex items-center mb-4">
//           <Select onValueChange={setSelectedCountry} value={selectedCountry}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select a country" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               {candidateCountries.map(country => (
//                 <SelectItem key={country} value={country}>
//                   {country}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <Button onClick={handleAddCountry} className="ml-4">Add Country</Button>
//         </div>
//           <h3 className='font-bold'>Select Main Services</h3>
//         <div className="flex items-center mb-4">
//           <ScrollArea className="h-64">
//           {services.map(service => (
//             <div key={service.name} className="flex items-center space-x-4 mb-4">
//               <Label className="flex-1">{service.name}</Label>
//               <Checkbox 
//                 checked={service.isFavorite} 
//                 onCheckedChange={() => handleFavoriteToggle(service.name)} 
//               />
//               <span>{service.isFavorite ? 'Main Service' : 'Set as Main Service'}</span>
//             </div>
//           ))}
//         </ScrollArea>
//         </div>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Country</TableHead>
//               <TableHead>Service</TableHead>
//               <TableHead>Previous Price ($)</TableHead>
//               <TableHead>Current Price ($)</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {data.map((item) => (
//               <TableRow key={item.country}>
//                 <TableCell>{item.country}</TableCell>
//                 <TableCell>
//                   <Select
//                     onValueChange={(value: string) => handleServiceChange(item.country, value)}
//                     value={selectedServices[item.country]}
//                   >
//                     <SelectTrigger className="w-[180px]">
//                       <SelectValue placeholder="Select a service" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-white">
//                       {commonServices.map((service) => (
//                         <SelectItem key={service.name} value={service.name}>
//                           {service.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </TableCell>
//                 <TableCell>
//                   {selectedServices[item.country] && 
//                     item.services.find(s => s.name === selectedServices[item.country])?.previousPrice.toFixed(2)}
//                 </TableCell>
//                 <TableCell>
//                   {selectedServices[item.country] && (
//                     <Input 
//                       type="number" 
//                       value={item.services.find(s => s.name === selectedServices[item.country])?.price || ''} 
//                       onChange={(e) => handlePriceChange(item.country, selectedServices[item.country], parseFloat(e.target.value))}
//                       step="0.01"
//                       min="0"
//                       className="w-24"
//                     />
//                   )}
//                 </TableCell>
//                 <TableCell className="flex space-x-2">
//                   <Button variant="outline" size="sm" onClick={() => handleUpdatePrice(item.country)}>
//                     Update
//                   </Button>
//                   <Button variant="destructive" size="sm" onClick={() => handleRemoveCountry(item.country)}>
//                     Remove
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//         {/* Price Update Confirmation Dialog */}
//         <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
//           <DialogContent className="bg-white">
//             <DialogHeader>
//               <DialogTitle>Confirm Price Update</DialogTitle>
//             </DialogHeader>
//             <DialogDescription>
//               Are you sure you want to update the price for the following service?
//             </DialogDescription>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="country" className="text-right">
//                   Country
//                 </Label>
//                 <Input id="country" value={dialogContent.country} className="col-span-3" readOnly />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="service" className="text-right">
//                   Service
//                 </Label>
//                 <Input id="service" value={dialogContent.service} className="col-span-3" readOnly />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="oldPrice" className="text-right">
//                   Old Price
//                 </Label>
//                 <Input id="oldPrice" value={dialogContent.oldPrice.toFixed(2)} className="col-span-3" readOnly />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="newPrice" className="text-right">
//                   New Price
//                 </Label>
//                 <Input id="newPrice" value={dialogContent.newPrice.toFixed(2)} className="col-span-3" readOnly />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsPriceDialogOpen(false)}>Cancel</Button>
//               <Button onClick={confirmUpdatePrice}>Confirm</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Remove Country Confirmation Dialog */}
//         <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
//           <DialogContent className="bg-white">
//             <DialogHeader>
//               <DialogTitle>Confirm Remove Country</DialogTitle>
//             </DialogHeader>
//             <DialogDescription>
//               Are you sure you want to remove {countryToRemove} from the list?
//             </DialogDescription>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsRemoveDialogOpen(false)}>Cancel</Button>
//               <Button variant="destructive" onClick={confirmRemoveCountry}>Confirm</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   )
// }
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

  // Update service price in Firestore
  // const confirmUpdatePrice = async () => {
  //   try {
  //     const { country, service, newPrice } = dialogContent;
  //     const serviceDocRef = doc(db, 'pricing',country, service);
  //     await updateDoc(serviceDocRef, { price: newPrice });

  //     setData(data.map(item =>
  //       item.country === country
  //         ? {
  //             ...item,
  //             services: item.services.map((s: Service) =>
  //               s.name === service ? { ...s, previousPrice: newPrice } : s
  //             )
  //           }
  //         : item
  //     ));
  //     setIsPriceDialogOpen(false);
  //   } catch (error) {
  //     console.error('Error updating service price:', error);
  //   }
  // };

// const confirmUpdatePrice = async () => {
//   try {
//     const { country, service, newPrice } = dialogContent;

//     // Create a reference to the service document
//     const serviceDocRef = doc(db, 'pricing', country+service);

//     // Check if the document exists
//     const docSnap = await getDoc(serviceDocRef);

//     if (docSnap.exists()) {
//       // If the document exists, update it
//       await updateDoc(serviceDocRef, { price: newPrice });
//     } else {
//       // If the document does not exist, create it
//       await setDoc(serviceDocRef, { price: newPrice });
//     }

//     // Update local state
//     setData(data.map(item =>
//       item.country === country
//         ? {
//             ...item,
//             services: item.services.map((s: Service) =>
//               s.name === service ? { ...s, previousPrice: newPrice } : s
//             )
//           }
//         : item
//     ));
//     setIsPriceDialogOpen(false);
//   } catch (error) {
//     console.error('Error updating service price:', error);
//   }
// };
const confirmUpdatePrice = async () => {
  try {
    const { country, service, newPrice } = dialogContent;

    // Generate the document ID by concatenating country and service
    const serviceDocId = `${country}_${service}`;  // Using underscore to separate values
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

  // Toggle "main" service status
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
        <h3 className="font-bold">Add New Country</h3>
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
          <Button onClick={handleAddCountry} className="ml-4">Add Country</Button>
        </div>

        {/* Services Table */}
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
                  <Button onClick={() => setIsPriceDialogOpen(true)}>Update Price</Button>
                  {/* <Checkbox
                    checked={item.services.some((s: Service) => s.isFavorite)}
                    onCheckedChange={() => handleFavoriteToggle(selectedServices[item.country])}
                  /> */}
                  
                </TableCell>
                <TableCell>
                <Button className='bg-red-600' onClick={() => {
                    setCountryToRemove(item.country)
                    setIsRemoveDialogOpen(true)
                  }}>Remove Country</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Price Dialog */}
        <Dialog open={isPriceDialogOpen} onOpenChange={setIsPriceDialogOpen}>
          <DialogContent>
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
              <Button onClick={confirmUpdatePrice}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Country Dialog */}
        <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Country</DialogTitle>
              <DialogDescription>Are you sure you want to remove this country?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={confirmRemoveCountry}>Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

