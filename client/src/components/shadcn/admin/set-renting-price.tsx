

// import React, { useState, useEffect } from "react"
// import { db } from "../../../firebase/config"
// import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore"
// import { Button } from "./../ui/button"
// import { Input } from "./../ui/input"
// import { Label } from "./../ui/label"
// import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card"
// import { ScrollArea } from "./../ui/scroll-area"
// import { useToast } from "./../ui/use-toast"
// import { Loader2, Save } from "lucide-react"

// interface Country {
//   code: string
//   name: string
//   iso: string
// }

// interface RentPricing {
//   [countryCode: string]: number
// }

// export default function RentNumberPricing() {
//   const [countries, setCountries] = useState<Country[]>([])
//   const [rentPricing, setRentPricing] = useState<RentPricing>({})
//   const [loading, setLoading] = useState(true)
//   const { toast } = useToast()

//   useEffect(() => {
//     fetchData()
//   }, [])

//   const fetchData = async () => {
//     try {
//       // Fetch countries
//       const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
//       const countriesSnapshot = await getDocs(countriesQuery)
//       const countriesData = countriesSnapshot.docs.map((doc) => ({
//         code: doc.id,
//         name: doc.data().name,
//         iso: doc.data().iso,
//       }))
//       setCountries(countriesData)

//       // Fetch rent pricing
//       const rentPricingSnapshot = await getDocs(collection(db, "rent_pricing"))
//       const rentPricingData: RentPricing = {}
//       rentPricingSnapshot.docs.forEach((doc) => {
//         rentPricingData[doc.id] = doc.data().pricePerDay
//       })

//       // If no pricing exists, initialize with default values
//       if (Object.keys(rentPricingData).length === 0) {
//         countriesData.forEach((country) => {
//           rentPricingData[country.code] = 1
//         })
//       }

//       setRentPricing(rentPricingData)
//       setLoading(false)
//     } catch (error) {
//       console.error("Error fetching data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to fetch data. Please try again.",
//         variant: "destructive",
//       })
//       setLoading(false)
//     }
//   }

//   const handlePriceChange = (countryCode: string, price: number) => {
//     setRentPricing((prev) => ({ ...prev, [countryCode]: price }))
//   }

//   const savePricing = async () => {
//     setLoading(true)
//     try {
//       for (const [countryCode, price] of Object.entries(rentPricing)) {
//         await setDoc(doc(db, "rent_pricing", countryCode), { pricePerDay: price })
//       }
//       toast({
//         title: "Success",
//         description: "Rent pricing saved successfully!",
//         variant: "success",
//       })
//     } catch (error) {
//       console.error("Error saving rent pricing:", error)
//       toast({
//         title: "Error",
//         description: "Failed to save rent pricing. Please try again.",
//         variant: "destructive",
//       })
//     }
//     setLoading(false)
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Rent Number Pricing Management</h1>
//       <Card>
//         <CardHeader>
//           <CardTitle>Edit Rent Pricing (Price per Day)</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-[400px] w-full border rounded-md p-4">
//             {countries.map((country) => (
//               <div key={country.code} className="flex items-center space-x-2 mt-2">
//                 <div className="flex items-center w-full">
//                   <img
//                     src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
//                     alt={`Flag of ${country.name}`}
//                     className="mr-2"
//                     width={20}
//                     height={20}
//                   />
//                   <span className="flex-grow">{country.name}</span>
//                   <Input
//                     type="number"
//                     value={rentPricing[country.code] || ""}
//                     onChange={(e) => handlePriceChange(country.code, Number(e.target.value))}
//                     className="w-24"
//                   />
//                 </div>
//               </div>
//             ))}
//           </ScrollArea>
//         </CardContent>
//       </Card>
//       <div className="mt-6">
//         <Button onClick={savePricing} disabled={loading}>
//           {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
//           Save Rent Pricing
//         </Button>
//       </div>
//     </div>
//   )
// }

import React, { useState, useEffect, useMemo } from "react"
import { db } from "../../../firebase/config"
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore"
import { Button } from "./../ui/button"
import { Input } from "./../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./../ui/card"
import { ScrollArea } from "./../ui/scroll-area"
import { useToast } from "./../ui/use-toast"
import { Loader2, Save, Search } from "lucide-react"

interface Country {
  code: string
  name: string
  iso: string
}

interface RentPricing {
  [countryCode: string]: number
}

export default function RentNumberPricing() {
  const [countries, setCountries] = useState<Country[]>([])
  const [rentPricing, setRentPricing] = useState<RentPricing>({})
  const [originalRentPricing, setOriginalRentPricing] = useState<RentPricing>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch countries
      const countriesQuery = query(collection(db, "countries"), where("included", "==", true))
      const countriesSnapshot = await getDocs(countriesQuery)
      const countriesData = countriesSnapshot.docs.map((doc) => ({
        code: doc.id,
        name: doc.data().name,
        iso: doc.data().iso,
      }))
      setCountries(countriesData)

      // Fetch rent pricing
      const rentPricingSnapshot = await getDocs(collection(db, "rent_pricing"))
      const rentPricingData: RentPricing = {}
      rentPricingSnapshot.docs.forEach((doc) => {
        rentPricingData[doc.id] = doc.data().pricePerDay
      })

      // If no pricing exists, initialize with default values
      if (Object.keys(rentPricingData).length === 0) {
        countriesData.forEach((country) => {
          rentPricingData[country.code] = 1
        })
      }

      setRentPricing(rentPricingData)
      setOriginalRentPricing(JSON.parse(JSON.stringify(rentPricingData)))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handlePriceChange = (countryCode: string, price: number) => {
    setRentPricing((prev) => ({ ...prev, [countryCode]: price }))
  }

  const savePricing = async () => {
    setLoading(true)
    try {
      for (const [countryCode, price] of Object.entries(rentPricing)) {
        await setDoc(doc(db, "rent_pricing", countryCode), { pricePerDay: price })
      }
      setOriginalRentPricing(JSON.parse(JSON.stringify(rentPricing)))
      toast({
        title: "Success",
        description: "Rent pricing saved successfully!",
        variant: "success",
      })
    } catch (error) {
      console.error("Error saving rent pricing:", error)
      toast({
        title: "Error",
        description: "Failed to save rent pricing. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const hasChanges = useMemo(() => {
    return JSON.stringify(rentPricing) !== JSON.stringify(originalRentPricing)
  }, [rentPricing, originalRentPricing])

  const filteredCountries = useMemo(() => {
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.iso.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [countries, searchTerm])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
       <h1 className="text-3xl font-bold mb-6">Rent Number Pricing Management</h1>
        <Card className="mb-6 border-none">    <CardHeader>
          <CardTitle>Edit Rent Pricing (Price per Day)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="h-[400px] w-full border rounded-md p-4">
            {filteredCountries.map((country) => (
              <div key={country.code} className="flex items-center space-x-2 mb-2 p-2 hover:bg-gray-100 rounded">
                <img
                  src={`https://flagcdn.com/w20/${country.iso.toLowerCase()}.png`}
                  alt={`Flag of ${country.name}`}
                  className="mr-2"
                  width={20}
                  height={20}
                />
                <span className="flex-grow">{country.name}</span>
                <Input
                  type="number"
                  value={rentPricing[country.code] || ""}
                  onChange={(e) => handlePriceChange(country.code, Number(e.target.value))}
                  className="w-24"
                />
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button onClick={savePricing} disabled={loading || !hasChanges}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {hasChanges ? "Save Changes" : "No Changes to Save"}
        </Button>
      </div>
    </div>
  )
}

