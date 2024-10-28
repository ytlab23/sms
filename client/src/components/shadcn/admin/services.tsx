

// //this one works fine

// import React, { useState, useEffect } from 'react';
// import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
// import { db } from '../../../firebase/config';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
// import { Input } from "./../ui/input";
// import { Button } from "./../ui/button";
// import { Checkbox } from "./../ui/checkbox";
// import { ScrollArea } from "./../ui/scrollarea";
// import { useToast } from "./../ui/use-toast"

// type Service = {
//   name: string;
//   price: number;
//   main: boolean;
//   isIncluded: boolean;
// };

// export default function ServicesMenu() {
//   const [services, setServices] = useState<Service[]>([]);
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchServicesFromFirestore();
//   }, []);

//   const fetchServicesFromFirestore = async () => {
//     try {
//       const servicesSnapshot = await getDocs(collection(db, 'services'));
//       const fetchedServices: Service[] = [];

//       servicesSnapshot.forEach((doc) => {
//         const serviceData = doc.data() as Service;
//         fetchedServices.push({ ...serviceData, name: doc.id });
//       });

//       setServices(fetchedServices);
//     } catch (error) {
//       console.error('Error fetching services:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch services. Please try again.",
//         variant: "destructive",
//       })
//     }
//   };

//   const handleFavoriteToggle = async (serviceName: string) => {
//     try {
//       const serviceDocRef = doc(db, 'services', serviceName);
//       const updatedServices = services.map((service) =>
//         service.name === serviceName
//           ? { ...service, main: !service.main }
//           : service
//       );

//       setServices(updatedServices);
//       await updateDoc(serviceDocRef, {
//         main: updatedServices.find((s) => s.name === serviceName)?.main,
//       });
//       toast({
//         title: "Success",
//         description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.main ? 'a main' : 'not a main'} service.`,
//       })
//     } catch (error) {
//       console.error('Error updating service to main:', error);
//       toast({
//         title: "Error",
//         description: `Failed to update ${serviceName}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   };

//   const handleIncludedToggle = async (serviceName: string) => {
//     try {
//       const serviceDocRef = doc(db, 'services', serviceName);
//       const updatedServices = services.map((service) =>
//         service.name === serviceName
//           ? { ...service, isIncluded: !service.isIncluded }
//           : service
//       );

//       setServices(updatedServices);
//       await  updateDoc(serviceDocRef, {
//         isIncluded: updatedServices.find((s) => s.name === serviceName)?.isIncluded,
//       });
//       toast({
//         title: "Success",
//         description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.isIncluded ? 'included' : 'not included'}.`,
//       })
//     } catch (error) {
//       console.error('Error updating service inclusion:', error);
//       toast({
//         title: "Error",
//         description: `Failed to update ${serviceName}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   };

//   const handleUpdatePrice = async (serviceName: string, newPrice: number) => {
//     try {
//       const serviceDocRef = doc(db, 'services', serviceName);
//       await updateDoc(serviceDocRef, { price: newPrice });
//       setServices((prevServices) =>
//         prevServices.map((s) =>
//           s.name === serviceName ? { ...s, price: newPrice } : s
//         )
//       );
//       toast({
//         title: "Success",
//         description: `Price updated for ${serviceName}.`,
//       })
//     } catch (error) {
//       console.error('Error updating service price:', error);
//       toast({
//         title: "Error",
//         description: `Failed to update price for ${serviceName}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   };

//   return (
//     <div>
//       {/* <h2 className="font-bold mb-4">3. Update Default Pricing for Services</h2> */}
//       <ScrollArea className="h-[500px] border rounded-md p-4">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="sticky top-0 bg-white">Service Name</TableHead>
//               <TableHead className="sticky top-0 bg-white">Main</TableHead>
//               <TableHead className="sticky top-0 bg-white">Include Service</TableHead>
//               <TableHead className="sticky top-0 bg-white">Current Price ($)</TableHead>
//               <TableHead className="sticky top-0 bg-white">Update Price ($)</TableHead>
//               <TableHead className="sticky top-0 bg-white">Update</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {services.map((service) => (
//               <TableRow key={service.name}>
//                 <TableCell>{service.name}</TableCell>
//                 <TableCell>
//                   <Checkbox
//                     checked={service.main}
//                     onCheckedChange={() => handleFavoriteToggle(service.name)}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Checkbox
//                     checked={service.isIncluded}
//                     onCheckedChange={() => handleIncludedToggle(service.name)}
//                   />
//                 </TableCell>
//                 <TableCell>{service.price.toFixed(2)}</TableCell>
//                 <TableCell>
//                   <Input
//                     type="number"
//                     value={service.price}
//                     onChange={(e) =>
//                       setServices((prevServices) =>
//                         prevServices.map((s) =>
//                           s.name === service.name
//                             ? { ...s, price: Number(e.target.value) }
//                             : s
//                         )
//                       )
//                     }
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Button
//                     className="text-white"
//                     onClick={() => handleUpdatePrice(service.name, service.price)}
//                   >
//                     Update
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </ScrollArea>
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from 'react'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from './../../../firebase/config'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table"
import { Input } from "./../ui/input"
import { Button } from "./../ui/button"
import { Checkbox } from "./../ui/checkbox"
import { ScrollArea } from "./../ui/scrollarea"
import { useToast } from "./../ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select"

type Service = {
  name: string
  price: number
  main: boolean
  isIncluded: boolean
}

type FilterOption = 'all' | 'main' | 'not-main'
type InclusionOption = 'all' | 'included' | 'not-included'

export default function ServicesMenu() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')
  const [inclusionOption, setInclusionOption] = useState<InclusionOption>('all')
  const { toast } = useToast()

  useEffect(() => {
    fetchServicesFromFirestore()
  }, [])

  const fetchServicesFromFirestore = async () => {
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'))
      const fetchedServices: Service[] = []

      servicesSnapshot.forEach((doc) => {
        const serviceData = doc.data() as Service
        fetchedServices.push({ ...serviceData, name: doc.id })
      })

      setServices(fetchedServices)
    } catch (error) {
      console.error('Error fetching services:', error)
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFavoriteToggle = async (serviceName: string) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName)
      const updatedServices = services.map((service) =>
        service.name === serviceName
          ? { ...service, main: !service.main }
          : service
      )

      setServices(updatedServices)
      await updateDoc(serviceDocRef, {
        main: updatedServices.find((s) => s.name === serviceName)?.main,
      })
      toast({
        variant: "success",
        title: "Success",
        description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.main ? 'a main' : 'not a main'} service.`,
      })
    } catch (error) {
      console.error('Error updating service to main:', error)
      toast({
        title: "Error",
        description: `Failed to update ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleIncludedToggle = async (serviceName: string) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName)
      const updatedServices = services.map((service) =>
        service.name === serviceName
          ? { ...service, isIncluded: !service.isIncluded }
          : service
      )

      setServices(updatedServices)
      await updateDoc(serviceDocRef, {
        isIncluded: updatedServices.find((s) => s.name === serviceName)?.isIncluded,
      })
      toast({
        variant: "success",
        title: "Success",
        description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.isIncluded ? 'included' : 'not included'}.`,
      })
    } catch (error) {
      console.error('Error updating service inclusion:', error)
      toast({
        title: "Error",
        description: `Failed to update ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleUpdatePrice = async (serviceName: string, newPrice: number) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName)
      await updateDoc(serviceDocRef, { price: newPrice })
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.name === serviceName ? { ...s, price: newPrice } : s
        )
      )
      toast({
        variant: "success",
        title: "Success",
        description: `Price updated for ${serviceName}.`,
      })
    } catch (error) {
      console.error('Error updating service price:', error)
      toast({
        title: "Error",
        description: `Failed to update price for ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMainFilter = 
        filterOption === 'all' || 
        (filterOption === 'main' && service.main) || 
        (filterOption === 'not-main' && !service.main)
      const matchesInclusionFilter = 
        inclusionOption === 'all' || 
        (inclusionOption === 'included' && service.isIncluded) || 
        (inclusionOption === 'not-included' && !service.isIncluded)
      return matchesSearch && matchesMainFilter && matchesInclusionFilter
    })
  }, [services, searchTerm, filterOption, inclusionOption])

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={filterOption} onValueChange={(value: FilterOption) => setFilterOption(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter main services" />
          </SelectTrigger>
          <SelectContent className="z-9999 bg-slate-100">
            <SelectItem className="hover:text-blue-600"  value="all">All Services</SelectItem>
            <SelectItem className="hover:text-blue-600" value="main">Main Services</SelectItem>
            <SelectItem className="hover:text-blue-600" value="not-main">Not Main Services</SelectItem>
          </SelectContent>
        </Select>
        <Select value={inclusionOption} onValueChange={(value: InclusionOption) => setInclusionOption(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter included services" />
          </SelectTrigger>
          <SelectContent className="z-9999 bg-slate-100">
            <SelectItem className="hover:text-blue-600" value="all">All Services</SelectItem>
            <SelectItem className="hover:text-blue-600" value="included">Included Services</SelectItem>
            <SelectItem className="hover:text-blue-600" value="not-included">Not Included Services</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[500px] border rounded-md p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 bg-white">Service Name</TableHead>
              <TableHead className="sticky top-0 bg-white">Main</TableHead>
              <TableHead className="sticky top-0 bg-white">Include Service</TableHead>
              <TableHead className="sticky top-0 bg-white">Current Price ($)</TableHead>
              <TableHead className="sticky top-0 bg-white">Update Price ($)</TableHead>
              <TableHead className="sticky top-0 bg-white">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.name}>
                <TableCell>{service.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={service.main}
                    onCheckedChange={() => handleFavoriteToggle(service.name)}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={service.isIncluded}
                    onCheckedChange={() => handleIncludedToggle(service.name)}
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
                  <Button
                    className="text-white"
                    onClick={() => handleUpdatePrice(service.name, service.price)}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}