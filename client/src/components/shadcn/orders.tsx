
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { RefreshCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Search, RefreshCw } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/authcontext';
import { Link } from 'react-router-dom';
import Loader2 from '../../common/loader2';
import { useTranslation } from 'react-i18next';

type Order = {
  id: string;
  phoneNumber: string;
  country: string;
  provider: string;
  service: string;
  status: string; 
  expiresAt: string;
};

export default function Orders() {
  const { currentUser } = useAuth();
  const {t} = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${currentUser?.uid}/products`),
      ); 
      const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => ({
        id: doc.data().id,
        phoneNumber: doc.data().phone,
        country: doc.data().country,
        provider: doc.data().operator,
        service: doc.data().product,
        status: doc.data().status,
        expiresAt: doc.data().expires,
      }));

      fetchedOrders.sort((a, b) => {
        const dateA = new Date(a.expiresAt);
        const dateB = new Date(b.expiresAt);
        return dateB.getTime() - dateA.getTime();
      });
      setOrders(fetchedOrders);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorLoading(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-3xl font-bold mb-8">{t("order.Your Orders")}</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder={t("order.Search orders...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-boxdark-2"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button
          onClick={fetchOrders}
          disabled={isRefreshing}
          className={`flex text-white items-center gap-2 ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? t("order.Refreshing...") : t("order.Refresh")}
        </Button>
      </div>
      <div className="border rounded-lg overflow-x-auto ">
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("order.Phone Number")}</TableHead>
              <TableHead>{t("order.Country")}</TableHead>
              <TableHead>{t("order.Service")}</TableHead>
              <TableHead>{t("order.Expires At")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
            

              <TableRow key={order.id}>
                <TableCell className='text-blue-600'>
                  <Link to={`/sms?id=${order.id}`}>{order.phoneNumber}</Link>
                </TableCell>
                <TableCell>{order.country}</TableCell>
                <TableCell>{order.service}</TableCell>
              
                <TableCell>
                  {new Date(order.expiresAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {loading && (
       
        <Loader2 height={'100px'}></Loader2>
      )}
      {filteredOrders.length === 0 && !loading && !errorLoading && (
        <p className="text-center text-gray-500 mt-4">
        {t("order.No orders found matching your search.")}  
        </p>
      )}
      {errorLoading && (
        <>
          <p className="text-center text-gray-500 mt-4">
          {t("order.Error loading orders. Please try again.")}   
          </p>
        </>
      )}
    </div>
  );
}
