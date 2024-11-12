
// // // import { useEffect, useState } from 'react'
// // // import { Button } from './ui/button'
// // // import { Input } from './ui/input'
// // // import {
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableHead,
// // //   TableHeader,
// // //   TableRow,
// // // } from './ui/table'
// // // import { Badge } from './ui/badge'
// // // import { Search, RefreshCw, Copy, Trash2 } from 'lucide-react'
// // // import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
// // // import { db } from '../../firebase/config'
// // // import { useAuth } from '../../contexts/authcontext'
// // // import { Link } from 'react-router-dom'
// // // import Loader2 from '../../common/loader2'
// // // import { useTranslation } from 'react-i18next'
// // // import { toast } from './ui/use-toast'

// // // type Order = {
// // //   id: string
// // //   phoneNumber: string
// // //   country: string
// // //   provider: string
// // //   service: string
// // //   status: string
// // //   expiresAt: string
// // //   sms: {
// // //     created_at: string
// // //     date: string
// // //     sender: string
// // //     text: string
// // //     code: string
// // //   }[]
// // // }

// // // export default function Orders() {
// // //   const { currentUser } = useAuth()
// // //   const { t } = useTranslation()

// // //   const [searchTerm, setSearchTerm] = useState('')
// // //   const [isRefreshing, setIsRefreshing] = useState(false)
// // //   const [orders, setOrders] = useState<Order[]>([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [errorLoading, setErrorLoading] = useState(false)

// // //   const fetchOrders = async () => {
// // //     setIsRefreshing(true)
// // //     try {
// // //       const querySnapshot = await getDocs(
// // //         collection(db, `users/${currentUser?.uid}/products`)
// // //       )
// // //       const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => ({
// // //         id: doc.id,
// // //         phoneNumber: doc.data().phone,
// // //         country: doc.data().country,
// // //         provider: doc.data().operator,
// // //         service: doc.data().product,
// // //         status: doc.data().status,
// // //         expiresAt: doc.data().expires,
// // //         sms: doc.data().sms || [],
// // //       }))

// // //       fetchedOrders.sort((a, b) => {
// // //         const dateA = new Date(a.expiresAt)
// // //         const dateB = new Date(b.expiresAt)
// // //         return dateB.getTime() - dateA.getTime()
// // //       })
// // //       setOrders(fetchedOrders)
// // //       setLoading(false)
// // //     } catch (error) {
// // //       setLoading(false)
// // //       setErrorLoading(true)
// // //     } finally {
// // //       setIsRefreshing(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     fetchOrders()
// // //   }, [])

// // //   const filteredOrders = orders.filter(
// // //     (order) =>
// // //       order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       order.service.toLowerCase().includes(searchTerm.toLowerCase())
// // //   )

// // //   const copyToClipboard = (text: string) => {
// // //     navigator.clipboard.writeText(text)
// // //     toast({
// // //       title: "Copied to clipboard",
// // //       description: "The code has been copied to your clipboard.",
// // //     })
// // //   }

// // //   const deleteOrder = async (orderId: string) => {
// // //     try {
// // //       await deleteDoc(doc(db, `users/${currentUser?.uid}/products`, orderId))
// // //       setOrders(orders.filter(order => order.id !== orderId))
// // //       toast({
// // //         title: "Order deleted",
// // //         description: "The order has been successfully deleted.",
// // //       })
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to delete the order. Please try again.",
// // //         variant: "destructive",
// // //       })
// // //     }
// // //   }

// // //   return (
// // //     <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
// // //       <h1 className="text-3xl font-bold mb-8">{t("order.Your Orders")}</h1>
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div className="relative w-64">
// // //           <Input
// // //             type="text"
// // //             placeholder={t("order.Search orders...")}
// // //             value={searchTerm}
// // //             onChange={(e) => setSearchTerm(e.target.value)}
// // //             className="pl-10 dark:bg-boxdark-2"
// // //           />
// // //           <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
// // //         </div>
// // //         <Button
// // //           onClick={fetchOrders}
// // //           disabled={isRefreshing}
// // //           className={`flex text-white items-center gap-2 ${
// // //             isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
// // //           }`}
// // //         >
// // //           <RefreshCw
// // //             className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
// // //           />
// // //           {isRefreshing ? t("order.Refreshing...") : t("order.Refresh")}
// // //         </Button>
// // //       </div>
// // //       <div className="border rounded-lg overflow-hidden flex-grow">
// // //         <div className="overflow-auto h-full">
// // //           <Table>
// // //             <TableHeader>
// // //               <TableRow>
// // //                 <TableHead>{t("order.Phone Number")}</TableHead>
// // //                 <TableHead>{t("order.Country")}</TableHead>
// // //                 <TableHead>{t("order.Service")}</TableHead>
// // //                 <TableHead>{t("order.Expires At")}</TableHead>
// // //                 <TableHead>{t("order.SMS Codes")}</TableHead>
// // //                 <TableHead>{t("order.Actions")}</TableHead>
// // //               </TableRow>
// // //             </TableHeader>
// // //             <TableBody>
// // //               {filteredOrders.map((order) => (
// // //                 <TableRow key={order.id}>
// // //                   <TableCell className='text-blue-600'>
// // //                     <Link to={`/sms?id=${order.id}`}>{order.phoneNumber}</Link>
// // //                   </TableCell>
// // //                   <TableCell>{order.country}</TableCell>
// // //                   <TableCell>{order.service}</TableCell>
// // //                   <TableCell>
// // //                     {new Date(order.expiresAt).toLocaleString()}
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     {order.sms.length > 0 ? (
// // //                       <div className="flex items-center">
// // //                         <span className="mr-2">
// // //                           {order.sms.map(sms => sms.code).join(', ')}
// // //                         </span>
// // //                         <Button
// // //                           variant="ghost"
// // //                           size="sm"
// // //                           className="p-1 text-primary hover:text-primary-dark"
// // //                           onClick={() => copyToClipboard(order.sms.map(sms => sms.code).join(', '))}
// // //                         >
// // //                           <Copy className="h-4 w-4" />
// // //                         </Button>
// // //                       </div>
// // //                     ) : (
// // //                       'No SMS'
// // //                     )}
// // //                   </TableCell>
// // //                   <TableCell>
// // //                     <Button
// // //                       variant="ghost"
// // //                       size="sm"
// // //                       className="p-1 text-red-500 hover:text-red-700"
// // //                       onClick={() => deleteOrder(order.id)}
// // //                     >
// // //                       <Trash2 className="h-4 w-4" />
// // //                     </Button>
// // //                   </TableCell>
// // //                 </TableRow>
// // //               ))}
// // //             </TableBody>
// // //           </Table>
// // //         </div>
// // //       </div>
// // //       {loading && (
// // //         <Loader2 height={'100px'}></Loader2>
// // //       )}
// // //       {filteredOrders.length === 0 && !loading && !errorLoading && (
// // //         <p className="text-center text-gray-500 mt-4">
// // //           {t("order.No orders found matching your search.")}  
// // //         </p>
// // //       )}
// // //       {errorLoading && (
// // //         <p className="text-center text-gray-500 mt-4">
// // //           {t("order.Error loading orders. Please try again.")}   
// // //         </p>
// // //       )}
// // //     </div>
// // //   )
// // // }
// // import { useEffect, useState } from 'react'
// // import { Button } from './ui/button'
// // import { Input } from './ui/input'
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableHead,
// //   TableHeader,
// //   TableRow,
// // } from './ui/table'
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger,
// // } from "./ui/dialog"
// // import { Search, RefreshCw, Copy, Trash2 } from 'lucide-react'
// // import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
// // import { db } from '../../firebase/config'
// // import { useAuth } from '../../contexts/authcontext'
// // import { Link } from 'react-router-dom'
// // import Loader2 from '../../common/loader2'
// // import { useTranslation } from 'react-i18next'
// // import { toast } from './ui/use-toast'

// // type Order = {
// //   id: string
// //   phoneNumber: string
// //   country: string
// //   provider: string
// //   service: string
// //   status: string
// //   expiresAt: string
// //   createdAt: string
// //   refunded: Boolean
// //   sms: {
// //     created_at: string
// //     date: string
// //     sender: string
// //     text: string
// //     code: string
// //   }[]
// // }

// // export default function Orders() {
// //   const { currentUser } = useAuth()
// //   const { t ,i18n} = useTranslation()

// //   const [searchTerm, setSearchTerm] = useState('')
// //   const [isRefreshing, setIsRefreshing] = useState(false)
// //   const [orders, setOrders] = useState<Order[]>([])
// //   const [loading, setLoading] = useState(true)
// //   const [errorLoading, setErrorLoading] = useState(false)
// //   const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
// //   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

// //   const fetchOrders = async () => {
// //     setIsRefreshing(true)
// //     try {
// //       const querySnapshot = await getDocs(
// //         collection(db, `users/${currentUser?.uid}/products`)
// //       )
// //       const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => ({
// //         id: doc.id,
// //         phoneNumber: doc.data().phone,
// //         country: doc.data().country,
// //         provider: doc.data().operator,
// //         service: doc.data().product,
// //         status: doc.data().status,
// //         expiresAt: doc.data().expires,
// //         createdAt: doc.data().createdAt || new Date().toISOString(), // Fallback to current date if createdAt is not available
// //         sms: doc.data().sms || [],
// //         refunded: doc.data().refunded,
// //       }))

// //       fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
// //       setOrders(fetchedOrders)
// //       setLoading(false)
// //     } catch (error) {
// //       setLoading(false)
// //       setErrorLoading(true)
// //     } finally {
// //       setIsRefreshing(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchOrders()
// //   }, [])

// //   const filteredOrders = orders.filter(
// //     (order) =>
// //       order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       order.service.toLowerCase().includes(searchTerm.toLowerCase())
// //   )

// //   const copyToClipboard = (text: string) => {
// //     navigator.clipboard.writeText(text)
// //     toast({
// //       variant: "success",
// //       title: "Copied to clipboard",
// //       description: "The code has been copied to your clipboard.",
// //     })
// //   }

// //   const deleteOrder = async () => {
// //     if (!orderToDelete) return

// //     try {
// //       await deleteDoc(doc(db, `users/${currentUser?.uid}/products`, orderToDelete.id))
// //       setOrders(orders.filter(order => order.id !== orderToDelete.id))
// //       toast({
// //         variant: "success",
// //         title: "Order deleted",
// //         description: "The order has been successfully deleted.",
// //       })
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to delete the order. Please try again.",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setOrderToDelete(null)
// //       setIsDeleteDialogOpen(false)
// //     }
// //   }

// //   return (
// //     <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
// //       <h1 className="text-3xl font-bold mb-8">{t("order.Your Orders")}</h1>
// //       <div className="flex justify-between items-center mb-6">
// //         <div className="flex items-center gap-4">
// //           <div className="relative w-64">
// //             <Input
// //               type="text"
// //               placeholder={t("order.Search orders...")}
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="pl-10 dark:bg-boxdark-2"
// //             />
// //             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
// //           </div>
// //           <p className="text-sm text-gray-500">
// //             {t("order.Total Orders")}: {filteredOrders.length}
// //           </p>
// //         </div>
// //         <Button
// //           onClick={fetchOrders}
// //           disabled={isRefreshing}
// //           className={`flex text-white items-center gap-2 ${
// //             isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
// //           }`}
// //         >
// //           <RefreshCw
// //             className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
// //           />
// //           {isRefreshing ? t("order.Refreshing...") : t("order.Refresh")}
// //         </Button>
// //       </div>
// //       <div className="border rounded-lg overflow-hidden flex-grow">
// //         <div className="overflow-auto h-full">
// //           <Table>
// //             <TableHeader>
// //               <TableRow>
// //                 <TableHead>{t("order.Phone Number")}</TableHead>
// //                 <TableHead>{t("order.Country")}</TableHead>
// //                 <TableHead>{t("order.Service")}</TableHead>
// //                 <TableHead>{t("order.Expires At")}</TableHead>
// //                 <TableHead>{t("order.SMS Codes")}</TableHead>
// //                 <TableHead>{t("order.Actions")}</TableHead>
// //               </TableRow>
// //             </TableHeader>
// //             <TableBody>
// //               {filteredOrders.map((order) => (
// //                 <TableRow key={order.id}>
// //                   <TableCell className='text-blue-600'>
// //                     <Link to={`/${i18n.language}/${t("urls.sms")}?id=${order.id}`}>{order.phoneNumber}</Link>
// //                   </TableCell>
// //                   {/* <TableCell>{order.country}</TableCell>
// //                   <TableCell>{order.service}</TableCell> */}
// //                 <TableCell> {order.country.charAt(0).toUpperCase() + order.country.slice(1)}</TableCell>
// //                     <TableCell>{order.service.charAt(0).toUpperCase() + order.service.slice(1)}</TableCell>
// //                   <TableCell>
// //                     {new Date(order.expiresAt).toLocaleString()}
// //                   </TableCell>
// //                   <TableCell>
// //                     {order.sms.length > 0 ? (
// //                       <div className="flex items-center">
// //                         <span className="mr-2">
// //                           {order.sms.map(sms => sms.code).join(', ')}
// //                         </span>
// //                         <Button
// //                           variant="ghost"
// //                           size="sm"
// //                           className="p-1 text-primary hover:text-primary-dark"
// //                           onClick={() => copyToClipboard(order.sms.map(sms => sms.code).join(', '))}
// //                         >
// //                           <Copy className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     ) : (
// //                       'No SMS'
// //                     )}
// //                   </TableCell>
// //                   <TableCell>
// //                     <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
// //                       <DialogTrigger asChild>
// //                         <Button
// //                           variant="ghost"
// //                           size="sm"
// //                           className="p-1 text-red-500 hover:text-red-700"
// //                           onClick={() => {
// //                             setOrderToDelete(order)
// //                             setIsDeleteDialogOpen(true)
// //                           }}
// //                         >
// //                           <Trash2 className="h-4 w-4" />
// //                         </Button>
// //                       </DialogTrigger>
// //                       <DialogContent className="bg-white">
// //                         <DialogHeader>
// //                           <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
// //                           <DialogDescription>
// //                             This action cannot be undone. This will permanently delete the order
// //                             for the phone number <span className='text-blue-500'>{orderToDelete?.phoneNumber}</span>.
// //                           </DialogDescription>
// //                         </DialogHeader>
// //                         <DialogFooter>
// //                           <Button className='bg-blue-600 hover:bg-blue-500 text-white' variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
// //                           <Button className='bg-red-600 hover:bg-red-500 text-white' variant="destructive" onClick={deleteOrder}>Delete</Button>
// //                         </DialogFooter>
// //                       </DialogContent>
// //                     </Dialog>
// //                   </TableCell>
// //                 </TableRow>
// //               ))}
// //             </TableBody>
// //           </Table>
// //         </div>
// //       </div>
// //       {loading && (
// //         <Loader2 height={'100px'}></Loader2>
// //       )}
// //       {filteredOrders.length === 0 && !loading && !errorLoading && (
// //         <p className="text-center text-gray-500 mt-4">
// //           {t("order.No orders found matching your search.")}  
// //         </p>
// //       )}
// //       {errorLoading && (
// //         <p className="text-center text-gray-500 mt-4">
// //           {t("order.Error loading orders. Please try again.")}   
// //         </p>
// //       )}
// //     </div>
// //   )
// // }
// import { useEffect, useState } from 'react'
// import { Button } from './ui/button'
// import { Input } from './ui/input'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from './ui/table'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog"
// import { Search, RefreshCw, Copy, Trash2, ShoppingCart } from 'lucide-react'
// import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'
// import { db } from '../../firebase/config'
// import { useAuth } from '../../contexts/authcontext'
// import { Link, useNavigate } from 'react-router-dom'
// import Loader2 from '../../common/loader2'
// import { useTranslation } from 'react-i18next'
// import { toast } from './ui/use-toast'
// import { Badge } from './ui/badge'
// import axios from 'axios'

// type Order = {
//   id: string
//   phoneNumber: string
//   country: string
//   provider: string
//   service: string
//   status: string
//   expiresAt: string
//   createdAt: string
//   refunded: boolean
//   sms: {
//     created_at: string
//     date: string
//     sender: string
//     text: string
//     code: string
//   }[]
// }

// export default function Component() {
//   const { currentUser } = useAuth()
//   const { t, i18n } = useTranslation()
//   const navigate = useNavigate()

//   const [searchTerm, setSearchTerm] = useState('')
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [orders, setOrders] = useState<Order[]>([])
//   const [loading, setLoading] = useState(true)
//   const [errorLoading, setErrorLoading] = useState(false)
//   const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
//   const [buying, setBuying] = useState(false)
//   const [failedToBuy, setFailedToBuy] = useState(false)

//   const fetchOrders = async () => {
//     setIsRefreshing(true)
//     try {
//       const querySnapshot = await getDocs(
//         collection(db, `users/${currentUser?.uid}/products`)
//       )
//       const fetchedOrders: Order[] = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         phoneNumber: doc.data().phone,
//         country: doc.data().country,
//         provider: doc.data().operator,
//         service: doc.data().product,
//         status: doc.data().status,
//         expiresAt: doc.data().expires,
//         createdAt: doc.data().createdAt || new Date().toISOString(),
//         sms: doc.data().sms || [],
//         refunded: doc.data().refunded,
//       }))

//       fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       setOrders(fetchedOrders)
//       setLoading(false)
//     } catch (error) {
//       setLoading(false)
//       setErrorLoading(true)
//     } finally {
//       setIsRefreshing(false)
//     }
//   }

//   useEffect(() => {
//     fetchOrders()
//   }, [])

//   const filteredOrders = orders.filter(
//     (order) =>
//       order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.service.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast({
//       variant: "success",
//       title: "Copied to clipboard",
//       description: "The code has been copied to your clipboard.",
//     })
//   }

//   const deleteOrder = async () => {
//     if (!orderToDelete) return

//     try {
//       await deleteDoc(doc(db, `users/${currentUser?.uid}/products`, orderToDelete.id))
//       setOrders(orders.filter(order => order.id !== orderToDelete.id))
//       toast({
//         variant: "success",
//         title: "Order deleted",
//         description: "The order has been successfully deleted.",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete the order. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setOrderToDelete(null)
//       setIsDeleteDialogOpen(false)
//     }
//   }

//   const buyProduct = async (country: string, service: string) => {
//     setBuying(true)
//     setFailedToBuy(false)

//     try {
//       const response = await axios.post(
//         'https://smsverify-server.vercel.app/api/buy-product',
//         {
//           uid: currentUser?.uid,
//           country: country.toLowerCase(),
//           product: service.toLowerCase(),
//         },
//       )

//       const id = response.data?.product?.id ?? null

//       toast({
//         variant: 'success',
//         title: 'Product Purchased Successfully',
//         description: 'You Can Now Use The Service',
//       })
//       navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)

//       setBuying(false)
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 402) {
//           toast({
//             variant: 'destructive',
//             title:'Insufficient Balance',
//             description: 'Please TopUp Your Account',
//             action: (
//               <Button
//                 onClick={() => navigate(`/${i18n.language}/${t("urls.pay")}`)}
//                 variant="outline"
//               >
//                 Go To Payment
//               </Button>
//             ),
//           })
//         } else {
//           toast({
//             variant: 'destructive',
//             title: 'Purchase Failed',
//             description: 'Something Went Wrong',
//           })
//           setFailedToBuy(true)
//         }
//       } else {
//         setFailedToBuy(true)
//         toast({
//           variant: 'destructive',
//           title: 'Unknown Error',
//           description: 'Unknown Error Occurred',
//           action: (
//             <Button onClick={() => buyProduct(country, service)} variant="outline">
//               Try Again
//             </Button>
//           ),
//         })
//       }
//       setFailedToBuy(true)
//       setBuying(false)
//     }
//   }

//   const getStatusBadge = (order: Order) => {
//     if (order.sms.length > 0) {
//       return <Badge className="bg-green-500">Success</Badge>
//     } else if (order.refunded) {
//       return <Badge className="bg-yellow-500">Refunded</Badge>
//     } else if (new Date(order.expiresAt) < new Date()) {
//       return <Badge className="bg-red-500">Expired</Badge>
//     } else {
//       return <Badge className="bg-blue-500">Pending</Badge>
//     }
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
//       <h1 className="text-3xl font-bold mb-8">{t("order.Your Orders")}</h1>
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-4">
//           <div className="relative w-64">
//             <Input
//               type="text"
//               placeholder={t("order.Search orders...")}
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 dark:bg-boxdark-2"
//             />
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//           <p className="text-sm text-gray-500">
//             {t("order.Total Orders")}: {filteredOrders.length}
//           </p>
//         </div>
//         <Button
//           onClick={fetchOrders}
//           disabled={isRefreshing}
//           className={`flex text-white items-center gap-2 ${
//             isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
//           }`}
//         >
//           <RefreshCw
//             className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
//           />
//           {isRefreshing ? t("order.Refreshing...") : t("order.Refresh")}
//         </Button>
//       </div>
//       <div className="border rounded-lg overflow-hidden flex-grow">
//         <div className="overflow-auto h-full">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>{t("order.Phone Number")}</TableHead>
//                 <TableHead>{t("order.Country")}</TableHead>
//                 <TableHead>{t("order.Service")}</TableHead>
//                 <TableHead>{t("order.SMS Codes")}</TableHead>
//                 <TableHead>{t("order.Expires At")}</TableHead>
//                 <TableHead>{t("order.Status")}</TableHead>
//                 <TableHead>{t("order.Actions")}</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredOrders.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell className='text-blue-600'>
//                     <Link to={`/${i18n.language}/${t("urls.sms")}?id=${order.id}`}>{order.phoneNumber}</Link>
//                   </TableCell>
//                   <TableCell>{order.country.charAt(0).toUpperCase() + order.country.slice(1)}</TableCell>
//                   <TableCell>{order.service.charAt(0).toUpperCase() + order.service.slice(1)}</TableCell>
//                   <TableCell>
//                     {order.sms.length > 0 ? (
//                       <div className="flex items-center">
//                         <span className="mr-2">
//                           {order.sms.map(sms => sms.code).join(', ')}
//                         </span>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="p-1 text-primary hover:text-primary-dark"
//                           onClick={() => copyToClipboard(order.sms.map(sms => sms.code).join(', '))}
//                         >
//                           <Copy className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ) : (
//                       'No SMS'
//                     )}
//                   </TableCell>
//                   <TableCell>
//                     {new Date(order.expiresAt).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     {getStatusBadge(order)}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//                         <DialogTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="p-1 text-red-500 hover:text-red-700"
//                             onClick={() => {
//                               setOrderToDelete(order)
//                               setIsDeleteDialogOpen(true)
//                             }}
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="bg-white">
//                           <DialogHeader>
//                             <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
//                             <DialogDescription>
//                               This action cannot be undone. This will permanently delete the order
//                               for the phone number <span className='text-blue-500'>{orderToDelete?.phoneNumber}</span>.
//                             </DialogDescription>
//                           </DialogHeader>
//                           <DialogFooter>
//                             <Button className='bg-blue-600 hover:bg-blue-500 text-white' variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
//                             <Button className='bg-red-600 hover:bg-red-500 text-white' variant="destructive" onClick={deleteOrder}>Delete</Button>
//                           </DialogFooter>
//                         </DialogContent>
//                       </Dialog>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="p-1 text-green-500 hover:text-green-700"
//                         onClick={() => buyProduct(order.country, order.service)}
//                         disabled={buying}
//                       >
//                         <ShoppingCart className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       {loading && (
//         <Loader2 height={'100px'}></Loader2>
//       )}
//       {filteredOrders.length === 0 && !loading && !errorLoading && (
//         <p className="text-center text-gray-500 mt-4">
//           {t("order.No orders found matching your search.")}  
//         </p>
//       )}
//       {errorLoading && (
//         <p className="text-center text-gray-500 mt-4">
//           {t("order.Error loading orders. Please try again.")}   
//         </p>
//       )}
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Search, RefreshCw, Copy, Trash2, ShoppingCart } from 'lucide-react'
import { collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../contexts/authcontext'
import { Link, useNavigate } from 'react-router-dom'
import Loader2 from '../../common/loader2'
import { useTranslation } from 'react-i18next'
import { toast } from './ui/use-toast'
import { Badge } from './ui/badge'
import axios from 'axios'

type Order = {
  id: string
  phoneNumber: string
  country: string
  provider: string
  service: string
  status: string
  expiresAt: string
  createdAt: string
  refunded: boolean
  sms: {
    created_at: string
    date: string
    sender: string
    text: string
    code: string
  }[]
  price?: number
}

export default function Component() {
  const { currentUser } = useAuth()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [errorLoading, setErrorLoading] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [buyingOrderId, setBuyingOrderId] = useState<string | null>(null)

  const fetchOrders = async () => {
    setIsRefreshing(true)
    try {
      const querySnapshot = await getDocs(
        collection(db, `users/${currentUser?.uid}/products`)
      )
      const fetchedOrders: Order[] = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const orderData = doc.data()
        const price = await fetchPrice(orderData.country, orderData.product)
        return {
          id: doc.id,
          phoneNumber: orderData.phone,
          country: orderData.country,
          provider: orderData.operator,
          service: orderData.product,
          status: orderData.status,
          expiresAt: orderData.expires,
          createdAt: orderData.createdAt || new Date().toISOString(),
          sms: orderData.sms || [],
          refunded: orderData.refunded,
          price: price
        }
      }))

      fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setOrders(fetchedOrders)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setErrorLoading(true)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchPrice = async (country: string, service: string) => {
    const pricingKey = `${country.toLowerCase()}_${service.toLowerCase()}`
    try {
      const pricingRef = doc(db, 'pricing', pricingKey)
      const pricingSnapshot = await getDoc(pricingRef)
      
      if (pricingSnapshot.exists()) {
        return pricingSnapshot.data().price
      } else {
        const serviceRef = doc(db, 'services', service.toLowerCase())
        const serviceSnapshot = await getDoc(serviceRef)
        
        if (serviceSnapshot.exists()) {
          return serviceSnapshot.data().price
        }
      }
    } catch (error) {
      console.error('Error fetching price:', error)
    }
    return null
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      variant: "success",
      title: "Copied to clipboard",
      description: "The code has been copied to your clipboard.",
    })
  }

  const deleteOrder = async () => {
    if (!orderToDelete) return

    try {
      await deleteDoc(doc(db, `users/${currentUser?.uid}/products`, orderToDelete.id))
      setOrders(orders.filter(order => order.id !== orderToDelete.id))
      toast({
        variant: "success",
        title: "Order deleted",
        description: "The order has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOrderToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  const buyProduct = async (order: Order) => {
    setBuyingOrderId(order.id)
    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/buy-product',
        {
          uid: currentUser?.uid,
          country: order.country.toLowerCase(),
          product: order.service.toLowerCase(),
        },
      )

      const id = response.data?.product?.id ?? null

      toast({
        variant: 'success',
        title: 'Product Purchased Successfully',
        description: 'You Can Now Use The Service',
      })
      navigate(`/${i18n.language}/${t("urls.sms")}?id=${id}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 402) {
          toast({
            variant: 'destructive',
            title:'Insufficient Balance',
            description: 'Please TopUp Your Account',
            action: (
              <Button
                onClick={() => navigate(`/${i18n.language}/${t("urls.pay")}`)}
                variant="outline"
              >
                Go To Payment
              </Button>
            ),
          })
        } else {
          toast({
            variant: 'destructive',
            title: 'Purchase Failed',
            description: 'Something Went Wrong',
          })
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Unknown Error',
          description: 'Unknown Error Occurred',
          action: (
            <Button onClick={() => buyProduct(order)} variant="outline">
              Try Again
            </Button>
          ),
        })
      }
    } finally {
      setBuyingOrderId(null)
    }
  }

  const getStatusBadge = (order: Order) => {
    if (order.sms.length > 0) {
      return <Badge className="bg-green-500 hover:bg-green-600">Success</Badge>
    } else if (order.refunded) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Refunded</Badge>
    } else if (new Date(order.expiresAt) < new Date()) {
      return <Badge className="bg-red-500 hover:bg-red-600">Expired</Badge>
    } else {
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-8">{t("order.Your Orders")}</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
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
          <p className="text-sm text-gray-500">
            {t("order.Total Orders")}: {filteredOrders.length}
          </p>
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
      <div className="border rounded-lg overflow-hidden flex-grow">
        <div className="overflow-auto h-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("order.Phone Number")}</TableHead>
                <TableHead>{t("order.Country")}</TableHead>
                <TableHead>{t("order.Service")}</TableHead>
                <TableHead>{t("order.SMS Codes")}</TableHead>
                <TableHead>{t("order.Expires At")}</TableHead>
                <TableHead>{t("order.Status")}</TableHead>
                <TableHead>{t("order.Re-Buy")}</TableHead>
                <TableHead>{t("order.Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='text-blue-600'>
                    <Link to={`/${i18n.language}/${t("urls.sms")}?id=${order.id}`}>{order.phoneNumber}</Link>
                  </TableCell>
                  <TableCell>{order.country.charAt(0).toUpperCase() + order.country.slice(1)}</TableCell>
                  <TableCell>{order.service.charAt(0).toUpperCase() + order.service.slice(1)}</TableCell>
                  <TableCell>
                    {order.sms.length > 0 ? (
                      <div className="flex items-center">
                        <span className="mr-2">
                          {order.sms.map(sms => sms.code).join(', ')}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 text-primary hover:text-primary-dark"
                          onClick={() => copyToClipboard(order.sms.map(sms => sms.code).join(', '))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      'No SMS'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(order.expiresAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center gap-2">
                      <span>{t("order.Price")+ " "}{order.price ? `$${order.price.toFixed(2)}` : 'N/A'}</span>
                      <Button
                        // variant="outline"
                        size="sm"
                        className="p-1 text-whiten "
                        onClick={() => buyProduct(order)}
                        disabled={buyingOrderId !== null}
                      >{t("order.Buy again") + '  '}
                        {buyingOrderId === order.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 text-red-500 hover:text-red-700"
                            onClick={() => {
                              setOrderToDelete(order)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete the order
                              for the phone number <span className='text-blue-500'>{orderToDelete?.phoneNumber}</span>.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button className='bg-blue-600 hover:bg-blue-500 text-white' variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                            <Button className='bg-red-600 hover:bg-red-500 text-white' variant="destructive" onClick={deleteOrder}>Delete</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
        <p className="text-center text-gray-500 mt-4">
          {t("order.Error loading orders. Please try again.")}   
        </p>
      )}
    </div>
  )
}