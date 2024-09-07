import { useState } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Search, RefreshCw } from "lucide-react"

type Order = {
  id: string
  phoneNumber: string
  country: string
  provider: string
  service: string
  status: 'active' | 'expired'
  expiresAt: string
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', phoneNumber: '+1 (555) 123-4567', country: 'United States', provider: 'AT&T', service: 'WhatsApp', status: 'active', expiresAt: '2023-06-30 15:00:00' },
    { id: '2', phoneNumber: '+44 20 7123 4567', country: 'United Kingdom', provider: 'Vodafone', service: 'Facebook', status: 'expired', expiresAt: '2023-06-15 10:30:00' },
    { id: '3', phoneNumber: '+81 3-1234-5678', country: 'Japan', provider: 'NTT Docomo', service: 'Telegram', status: 'active', expiresAt: '2023-07-05 18:45:00' },
    { id: '4', phoneNumber: '+49 30 1234567', country: 'Germany', provider: 'Deutsche Telekom', service: 'Instagram', status: 'active', expiresAt: '2023-07-02 12:15:00' },
    { id: '5', phoneNumber: '+33 1 23 45 67 89', country: 'France', provider: 'Orange', service: 'Twitter', status: 'expired', expiresAt: '2023-06-20 09:00:00' },
  ])

  const filteredOrders = orders.filter(order => 
    order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const refreshOrders = () => {
    setIsRefreshing(true)
    // Simulate an API call
    setTimeout(() => {
      // In a real application, this would fetch new data from an API
      setOrders([...orders])
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button 
          onClick={refreshOrders} 
          disabled={isRefreshing}
          className={`flex text-white items-center gap-2 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      <div className="border rounded-lg overflow-x-auto bg-white">
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead>Phone Number</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{order.country}</TableCell>
                <TableCell>{order.provider}</TableCell>
                <TableCell>{order.service}</TableCell>
                <TableCell>
                  <Badge className='text-white' >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.expiresAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No orders found matching your search.</p>
      )}
    </div>
  )
}