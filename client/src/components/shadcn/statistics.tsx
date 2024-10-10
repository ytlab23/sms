
import { useState, useMemo } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { ShoppingCart } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

interface CountryServiceData {
  id: string
  country: string
  service: string
  successRate: number
  price: number
  currency: string
  quantity: number
}

const smsData: CountryServiceData[] = [
  { id: "1", country: "USA", service: "WhatsApp", successRate: 98.94, price: 31.5, currency: "$", quantity: 36208 },
  { id: "2", country: "UK", service: "Telegram", successRate: 42.5, price: 28.75, currency: "£", quantity: 15000 },
  { id: "3", country: "Germany", service: "Signal", successRate: 36.2, price: 30.0, currency: "€", quantity: 22000 },
  { id: "4", country: "France", service: "WhatsApp", successRate: 40.1, price: 29.5, currency: "€", quantity: 18500 },
  { id: "5", country: "Japan", service: "Line", successRate: 45.8, price: 3500, currency: "¥", quantity: 40000 },
]

export default function SMSStats() {
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined)
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined)

  const countries = useMemo(() => [...new Set(smsData.map(item => item.country))], [])
  const services = useMemo(() => [...new Set(smsData.map(item => item.service))], [])

  const filteredData = useMemo(() => {
    return smsData.filter(item => 
      (!selectedCountry || item.country === selectedCountry) &&
      (!selectedService || item.service === selectedService)
    )
  }, [selectedCountry, selectedService])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">SMS Verification Services</h1>
      
      <div className="flex space-x-4 mb-6">
        <Select onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent className=" bg-whiten" >
            <SelectItem  className="hover:text-blue-600" value="all-countries">All Countries</SelectItem>
            {countries.map(country => (
              <SelectItem className="hover:text-blue-600" key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setSelectedService}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Service" />
          </SelectTrigger>
          <SelectContent className="bg-whiten">
            <SelectItem className="hover:text-blue-600" value="all-services">All Services</SelectItem>
            {services.map(service => (
              <SelectItem className="hover:text-blue-600"  key={service} value={service}>{service}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredData.map((item) => (
          <Card key={item.id} className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{item.country}</h2>
                  <p className="text-lg text-muted-foreground">{item.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium">Available</p>
                  <p className="text-2xl font-bold">{item.quantity.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-4/5 bg-slate-300 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-400 h-full rounded-full"
                    style={{ width: `${item.successRate}%` }}
                    aria-label={`Success rate: ${item.successRate.toFixed(2)}%`}
                  ></div>
                </div>
                <span className="text-lg font-medium ml-4">{item.successRate.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">
                  {item.currency}{item.price.toFixed(2)}
                </span>
                <Button size="lg" className="text-white">
                  <ShoppingCart className="w-6 h-6 mr-2" aria-hidden="true" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}