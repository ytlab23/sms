// import React, { useState, useEffect } from 'react';
// import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
// import { db } from '../../../firebase/config';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./../ui/select";
// import { Button } from "./../ui/button";

// type Country = {
//   name: string;
//   included: boolean;
// };

// export default function AddCountries({ onCountryAdded }: { onCountryAdded: () => void }) {
//   const [candidateCountries, setCandidateCountries] = useState<string[]>([]);
//   const [selectedCountry, setSelectedCountry] = useState('');

//   useEffect(() => {
//     fetchCountriesFromFirestore();
//   }, []);

//   const fetchCountriesFromFirestore = async () => {
//     try {
//       const countriesSnapshot = await getDocs(collection(db, 'countries'));
//       const candidateCountries: string[] = [];

//       countriesSnapshot.forEach((doc) => {
//         const countryData = doc.data() as Country;
//         if (!countryData.included) {
//           candidateCountries.push(countryData.name);
//         }
//       });

//       setCandidateCountries(candidateCountries);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//     }
//   };

//   const handleAddCountry = async () => {
//     if (selectedCountry) {
//       try {
//         const countryDocRef = doc(db, 'countries', selectedCountry);
//         await updateDoc(countryDocRef, { included: true });
//         setCandidateCountries((prev) => prev.filter((country) => country !== selectedCountry));
//         setSelectedCountry('');
//         onCountryAdded();
//       } catch (error) {
//         console.error('Error adding country:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h3 className="font-bold mb-4">1. Add New Country</h3>
//       <div className="flex items-center mb-4">
//         <Select onValueChange={setSelectedCountry} value={selectedCountry}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select a country" />
//           </SelectTrigger>
//           <SelectContent className="bg-white">
//             {candidateCountries.map((country) => (
//               <SelectItem key={country} value={country}>
//                 {country}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Button onClick={handleAddCountry} className="ml-4 text-white">
//           Add Country
//         </Button>
//       </div>
//     </div>
//   );
// }
//this one works fine
// import React, { useState, useEffect } from 'react';
// import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
// import { db } from '../../../firebase/config';
// import { Button } from "./../ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
// import { Toast } from "./../ui/toast"
// import { useToast } from "./../ui/use-toast"

// type Country = {
//   name: string;
//   included: boolean;
// };

// export default function AddCountries({ onCountryChange }: { onCountryChange: () => void }) {
//   const [countries, setCountries] = useState<Country[]>([]);
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchCountriesFromFirestore();
//   }, []);

//   const fetchCountriesFromFirestore = async () => {
//     try {
//       const countriesSnapshot = await getDocs(collection(db, 'countries'));
//       const fetchedCountries: Country[] = [];

//       countriesSnapshot.forEach((doc) => {
//         const countryData = doc.data() as Country;
//         fetchedCountries.push({ ...countryData, name: doc.id });
//       });

//       setCountries(fetchedCountries);
//     } catch (error) {
//       console.error('Error fetching countries:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch countries. Please try again.",
//         variant: "destructive",
//       })
//     }
//   };

//   const handleToggleCountry = async (countryName: string, currentIncluded: boolean) => {
//     try {
//       const countryDocRef = doc(db, 'countries', countryName);
//       await updateDoc(countryDocRef, { included: !currentIncluded });
//       setCountries(countries.map(country => 
//         country.name === countryName ? { ...country, included: !currentIncluded } : country
//       ));
//       onCountryChange();
//       toast({
//         title: "Success",
//         description: `${countryName} has been ${!currentIncluded ? 'added to' : 'removed from'} the list.`,
//       })
//     } catch (error) {
//       console.error('Error toggling country:', error);
//       toast({
//         title: "Error",
//         description: `Failed to update ${countryName}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   };

//   const handleDeleteCountry = async (countryName: string) => {
//     try {
//       const countryDocRef = doc(db, 'countries', countryName);
//       await deleteDoc(countryDocRef);
//       setCountries(countries.filter(country => country.name !== countryName));
//       onCountryChange();
//       toast({
//         title: "Success",
//         description: `${countryName} has been deleted.`,
//       })
//     } catch (error) {
//       console.error('Error deleting country:', error);
//       toast({
//         title: "Error",
//         description: `Failed to delete ${countryName}. Please try again.`,
//         variant: "destructive",
//       })
//     }
//   };

//   return (
//     <div>
//       <h3 className="font-bold mb-4">1. Manage Countries</h3>
//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Country</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {countries.map((country) => (
//             <TableRow key={country.name}>
//               <TableCell>{country.name}</TableCell>
//               <TableCell>{country.included ? 'Included' : 'Not Included'}</TableCell>
//               <TableCell>
//                 <Button
//                   onClick={() => handleToggleCountry(country.name, country.included)}
//                   className="mr-2"
//                 >
//                   {country.included ? 'Remove' : 'Add'}
//                 </Button>
//                 <Button
//                   onClick={() => handleDeleteCountry(country.name)}
//                   variant="destructive"
//                 >
//                   Delete
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
//this one works fine
import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { Button } from "./../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../ui/table";
import { Toast } from "./../ui/toast"
import { useToast } from "./../ui/use-toast"
import { ScrollArea } from "./../ui/scrollarea";

type Country = {
  name: string;
  included: boolean;
};

export default function AddCountries({ onCountryChange }: { onCountryChange: () => void }) {
  const [countries, setCountries] = useState<Country[]>([]);
  const { toast } = useToast()

  useEffect(() => {
    fetchCountriesFromFirestore();
  }, []);

  const fetchCountriesFromFirestore = async () => {
    try {
      const countriesSnapshot = await getDocs(collection(db, 'countries'));
      const fetchedCountries: Country[] = [];

      countriesSnapshot.forEach((doc) => {
        const countryData = doc.data() as Country;
        fetchedCountries.push({ ...countryData, name: doc.id });
      });

      setCountries(fetchedCountries);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast({
        title: "Error",
        description: "Failed to fetch countries. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleToggleCountry = async (countryName: string, currentIncluded: boolean) => {
    try {
      const countryDocRef = doc(db, 'countries', countryName);
      await updateDoc(countryDocRef, { included: !currentIncluded });
      setCountries(countries.map(country => 
        country.name === countryName ? { ...country, included: !currentIncluded } : country
      ));
      onCountryChange();
      toast({
        title: "Success",
        description: `${countryName} has been ${!currentIncluded ? 'added to' : 'removed from'} the list.`,
      })
    } catch (error) {
      console.error('Error toggling country:', error);
      toast({
        title: "Error",
        description: `Failed to update ${countryName}. Please try again.`,
        variant: "destructive",
      })
    }
  };

  const handleDeleteCountry = async (countryName: string) => {
    try {
      const countryDocRef = doc(db, 'countries', countryName);
      await deleteDoc(countryDocRef);
      setCountries(countries.filter(country => country.name !== countryName));
      onCountryChange();
      toast({
        title: "Success",
        description: `${countryName} has been deleted.`,
      })
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${countryName}. Please try again.`,
        variant: "destructive",
      })
    }
  };

  return (
    <div>
      <h3 className="font-bold mb-4">1. Manage Countries</h3>
      <ScrollArea className="h-[300px] border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((country) => (
              <TableRow key={country.name}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.included ? 'Included' : 'Not Included'}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleToggleCountry(country.name, country.included)}
                    className="mr-2"
                  >
                    {country.included ? 'Remove' : 'Add'}
                  </Button>
                  <Button
                    onClick={() => handleDeleteCountry(country.name)}
                    variant="destructive"
                  >
                    Delete
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