// import React, { useState, useEffect } from 'react';
// import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
// import { db } from '../../../firebase/config';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
// import { Input } from "./../ui/input";
// import { Button } from "./../ui/button";
// import { Checkbox } from "./../ui/checkbox";
// import { ScrollArea } from "./../ui/scrollarea";

// type Service = {
//   name: string;
//   price: number;
//   main: boolean;
//   isIncluded: boolean;
// };

// export default function ServicesMenu() {
//   const [services, setServices] = useState<Service[]>([]);

//   useEffect(() => {
//     fetchServicesFromFirestore();
//   }, []);

//   const fetchServicesFromFirestore = async () => {
//     try {
//       const servicesSnapshot = await getDocs(collection(db, 'services'));
//       const fetchedServices: Service[] = [];

//       servicesSnapshot.forEach((doc) => {
//         const serviceData = doc.data() as Service;
//         fetchedServices.push(serviceData);
//       });

//       setServices(fetchedServices);
//     } catch (error) {
//       console.error('Error fetching services:', error);
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
//     } catch (error) {
//       console.error('Error updating service to main:', error);
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
//       await updateDoc(serviceDocRef, {
//         isIncluded: updatedServices.find((s) => s.name === serviceName)?.isIncluded,
//       });
//     } catch (error) {
//       console.error('Error updating service inclusion:', error);
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
//     } catch (error) {
//       console.error('Error updating service price:', error);
//     }
//   };

//   return (
//     <div>
//       <h2 className="font-bold mb-4">3. Update Default Pricing for Services</h2>
//       <ScrollArea className="h-[400px]">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Service Name</TableHead>
//               <TableHead>Main</TableHead>
//               <TableHead>Include Service</TableHead>
//               <TableHead>Previous Price ($)</TableHead>
//               <TableHead>Update Price ($)</TableHead>
//               <TableHead>Update</TableHead>
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
//this one works fine

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
//       await updateDoc(serviceDocRef, {
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
//       <h2 className="font-bold mb-4">3. Update Default Pricing for Services</h2>
//       <ScrollArea className="h-[400px]">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Service Name</TableHead>
//               <TableHead>Main</TableHead>
//               <TableHead>Include Service</TableHead>
//               <TableHead>Current Price ($)</TableHead>
//               <TableHead>Update Price ($)</TableHead>
//               <TableHead>Update</TableHead>
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

//this one works fine

import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
import { Input } from "./../ui/input";
import { Button } from "./../ui/button";
import { Checkbox } from "./../ui/checkbox";
import { ScrollArea } from "./../ui/scrollarea";
import { useToast } from "./../ui/use-toast"

type Service = {
  name: string;
  price: number;
  main: boolean;
  isIncluded: boolean;
};

export default function ServicesMenu() {
  const [services, setServices] = useState<Service[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    fetchServicesFromFirestore();
  }, []);

  const fetchServicesFromFirestore = async () => {
    try {
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const fetchedServices: Service[] = [];

      servicesSnapshot.forEach((doc) => {
        const serviceData = doc.data() as Service;
        fetchedServices.push({ ...serviceData, name: doc.id });
      });

      setServices(fetchedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to fetch services. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleFavoriteToggle = async (serviceName: string) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName);
      const updatedServices = services.map((service) =>
        service.name === serviceName
          ? { ...service, main: !service.main }
          : service
      );

      setServices(updatedServices);
      await updateDoc(serviceDocRef, {
        main: updatedServices.find((s) => s.name === serviceName)?.main,
      });
      toast({
        title: "Success",
        description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.main ? 'a main' : 'not a main'} service.`,
      })
    } catch (error) {
      console.error('Error updating service to main:', error);
      toast({
        title: "Error",
        description: `Failed to update ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  };

  const handleIncludedToggle = async (serviceName: string) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName);
      const updatedServices = services.map((service) =>
        service.name === serviceName
          ? { ...service, isIncluded: !service.isIncluded }
          : service
      );

      setServices(updatedServices);
      await  updateDoc(serviceDocRef, {
        isIncluded: updatedServices.find((s) => s.name === serviceName)?.isIncluded,
      });
      toast({
        title: "Success",
        description: `${serviceName} is now ${updatedServices.find((s) => s.name === serviceName)?.isIncluded ? 'included' : 'not included'}.`,
      })
    } catch (error) {
      console.error('Error updating service inclusion:', error);
      toast({
        title: "Error",
        description: `Failed to update ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  };

  const handleUpdatePrice = async (serviceName: string, newPrice: number) => {
    try {
      const serviceDocRef = doc(db, 'services', serviceName);
      await updateDoc(serviceDocRef, { price: newPrice });
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.name === serviceName ? { ...s, price: newPrice } : s
        )
      );
      toast({
        title: "Success",
        description: `Price updated for ${serviceName}.`,
      })
    } catch (error) {
      console.error('Error updating service price:', error);
      toast({
        title: "Error",
        description: `Failed to update price for ${serviceName}. Please try again.`,
        variant: "destructive",
      })
    }
  };

  return (
    <div>
      {/* <h2 className="font-bold mb-4">3. Update Default Pricing for Services</h2> */}
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
            {services.map((service) => (
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
  );
}