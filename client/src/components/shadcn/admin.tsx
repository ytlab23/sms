
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import {db} from '../../firebase/config'

const initialData = [
  { 
    country: 'USA', 
    services: [
      { name: 'WhatsApp', price: 0.5, previousPrice: 0.48 },
      { name: 'Telegram', price: 0.45, previousPrice: 0.45 },
      { name: 'SMS', price: 0.3, previousPrice: 0.28 },
    ]
  },
  { 
    country: 'UK', 
    services: [
      { name: 'WhatsApp', price: 0.52, previousPrice: 0.50 },
      { name: 'Telegram', price: 0.6, previousPrice: 0.55 },
      { name: 'SMS', price: 0.35, previousPrice: 0.32 },
    ]
  },
]

export default function Admin() {
  const [data, setData] = useState(initialData)
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogContent, setDialogContent] = useState({ country: '', service: '', oldPrice: 0, newPrice: 0 })

  const handleServiceChange = (country: string, serviceName: string) => {
    setSelectedServices(prev => ({ ...prev, [country]: serviceName }))
  }

  const handlePriceChange = (country: string, serviceName: string, newPrice: number) => {
    setData(data.map(item => 
      item.country === country 
        ? {
            ...item,
            services: item.services.map(s => 
              s.name === serviceName ? { ...s, price: newPrice } : s
            )
          }
        : item
    ))
  }

  const handleUpdatePrice = (country: string) => {
    const countryData = data.find(item => item.country === country)
    const selectedService = selectedServices[country]
    if (countryData && selectedService) {
      const service = countryData.services.find(s => s.name === selectedService)
      if (service) {
        setDialogContent({
          country,
          service: service.name,
          oldPrice: service.previousPrice,
          newPrice: service.price
        })
        setIsDialogOpen(true)
      }
    }
  }

  const confirmUpdatePrice = () => {
    setData(data.map(item => 
      item.country === dialogContent.country 
        ? {
            ...item,
            services: item.services.map(s => 
              s.name === dialogContent.service 
                ? { ...s, previousPrice: dialogContent.newPrice }
                : s
            )
          }
        : item
    ))
    setIsDialogOpen(false)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>SMSVerify Pricing Admin Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Previous additional Price ($)</TableHead>
              <TableHead>Current additional Price ($)</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.country}>
                <TableCell>{item.country}</TableCell>
                <TableCell>
                <Select
                    onValueChange={(value: string) => handleServiceChange(item.country, value)}
                    value={selectedServices[item.country]}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        {item.services.map((service) => (
                            <SelectItem key={service.name} value={service.name}>
                                {service.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                </TableCell>
                <TableCell>
                  {selectedServices[item.country] && 
                    item.services.find(s => s.name === selectedServices[item.country])?.previousPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  {selectedServices[item.country] && (
                    <Input 
                      type="number" 
                      value={item.services.find(s => s.name === selectedServices[item.country])?.price || ''} 
                      onChange={(e) => handlePriceChange(item.country, selectedServices[item.country], parseFloat(e.target.value))}
                      step="0.01"
                      min="0"
                      className="w-24"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => handleUpdatePrice(item.country)}>
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Confirm Price Update</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to update the price for the following service?
            </DialogDescription>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">
                  Country
                </Label>
                <Input id="country" value={dialogContent.country} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Input id="service" value={dialogContent.service} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="oldPrice" className="text-right">
                  Old Price
                </Label>
                <Input id="oldPrice" value={dialogContent.oldPrice.toFixed(2)} className="col-span-3" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPrice" className="text-right">
                  New Price
                </Label>
                <Input id="newPrice" value={dialogContent.newPrice.toFixed(2)} className="col-span-3" readOnly />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmUpdatePrice}>Confirm Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}