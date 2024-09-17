// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button } from './ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
// import { Badge } from './ui/badge';
// import { ScrollArea } from './ui/scrollarea';
// import { Loader2, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
// import { useAuth } from '../../contexts/authcontext';

// interface SMS {
//   id: string;
//   message: string;
//   timestamp: string;
// }

// interface NumberDetails {
//   id: string;
//   number: string;
//   country: string;
//   operator: string;
//   service: string;
//   status: 'active' | 'expired' | undefined | false;
//   refunded: boolean;
// }

// // Component
// export default function Sms({ numberId }: { numberId: string }) {
//   const [numberDetails, setNumberDetails] = useState<NumberDetails | null>(null);
//   const [smsList, setSmsList] = useState<SMS[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMessagesOpen, setIsMessagesOpen] = useState(false);
//   const { currentUser } = useAuth();


//   const fetchSMS = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get('https://smsverify-server.vercel.app/api/get-sms', {
//         params: { uid: currentUser?.uid, numberId },
//       });

//       const smsData = response.data;
//       setNumberDetails({
//         id: smsData.id,
//         number: smsData.phone,
//         country: smsData.country,
//         operator: 'Unknown', // Assuming operator info is not in the response
//         service: smsData.product,
//         status: smsData.status === 'RECEIVED' ? 'active' : smsData.status === 'PENDING' ? 'active' : smsData.status === 'CANCELED' ? 'expired' : smsData.status === 'TIMEOUT' ? 'expired' : smsData.status === 'FINISHED' ? 'expired' : undefined,
//         refunded: smsData.refunded || false, // Assuming refunded info is in the response
//       });

//       const smsMessages = smsData.sms.map((sms: any) => ({
//         id: sms.created_at,
//         message: sms.text,
//         timestamp: sms.date,
//       }));
//       setSmsList(smsMessages);
//     } catch (error) {
//       console.error('Error fetching SMS:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSMS(); // Fetch SMS on component mount
//   }, []);

//   const requestNewSMS = async () => {
//     await fetchSMS(); // Re-fetch SMS to refresh the list
//   };

//   const cancelService = () => {
//     if (numberDetails) {
//       console.log('Service cancelled for number:', numberDetails.number);
//       setNumberDetails({ ...numberDetails, status: 'expired' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <Card className="w-full ml-28 mr-28">
//         <CardHeader>
//           <CardTitle className="text-2xl">Your SMS</CardTitle>
//           <CardDescription>Number ID: {numberId}</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {numberDetails && (
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-lg font-semibold mb-2">Number Details</h3>
//               <div className="grid grid-cols-2 gap-2">
//                 <p>
//                   <strong>Number:</strong>{' '}
//                   <Dialog open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
//                     <DialogTrigger asChild>
//                       <Button variant="link" className="p-0 h-auto font-normal">
//                         {numberDetails.number}
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[425px] bg-white">
//                       <DialogHeader>
//                         <DialogTitle>Messages for {numberDetails.number}</DialogTitle>
//                         <DialogDescription>
//                           All SMS messages received for this number.
//                         </DialogDescription>
//                       </DialogHeader>
//                       <ScrollArea className="h-[300px] w-full rounded-md border p-4">
//                         {smsList.length > 0 ? (
//                           smsList.map((sms) => (
//                             <div key={sms.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
//                               <div className="flex items-start space-x-2">
//                                 <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
//                                 <div>
//                                   <p className="text-sm text-gray-800">{sms.message}</p>
//                                   <p className="text-xs text-gray-500 mt-1">{sms.timestamp}</p>
//                                 </div>
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <p className="text-center text-gray-500">No SMS messages received yet.</p>
//                         )}
//                       </ScrollArea>
//                       <DialogFooter>
//                         <Button onClick={() => setIsMessagesOpen(false)}>Close</Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
//                 </p>
//                 <p><strong>Country:</strong> {numberDetails.country}</p>
//                 <p><strong>Operator:</strong> {numberDetails.operator}</p>
//                 <p><strong>Service:</strong> {numberDetails.service}</p>
//                 <p>
//                   <strong>Status:</strong>{' '}
//                   <Badge className={`ml-2 ${numberDetails.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
//                     {numberDetails.status}
//                   </Badge>
//                 </p>
//               </div>
//             </div>
//           )}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="text-lg font-semibold">Received SMS</h3>
//               <Button onClick={requestNewSMS} disabled={isLoading || numberDetails?.status === 'expired'}>
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting
//                   </>
//                 ) : (
//                   <>
//                     <RefreshCw className="mr-2 h-4 w-4" /> Request New SMS
//                   </>
//                 )}
//               </Button>
//             </div>
//             <ScrollArea className="h-[300px] w-full rounded-md border p-4">
//               {smsList.length > 0 ? (
//                 smsList.map((sms) => (
//                   <div key={sms.id} className="mb-4 p-3 bg-white rounded-lg shadow">
//                     <div className="flex items-start space-x-2">
//                       <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
//                       <div>
//                         <p className="text-sm text-gray-800">{sms.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">{sms.timestamp}</p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500">No SMS messages received yet.</p>
//               )}
//             </ScrollArea>
//           </div>
//         </CardContent>
//         <CardFooter className="justify-between bg-white">
//           <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button variant="destructive">
//                 <AlertCircle className="mr-2 h-4 w-4" />
//                 Cancel Service
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="bg-white">
//               <DialogHeader>
//                 <DialogTitle>Are you sure you want to cancel the service?</DialogTitle>
//                 <DialogDescription>
//                   This action cannot be undone. You will lose access to this number and all associated messages.
//                 </DialogDescription>
//               </DialogHeader>
//               <DialogFooter>
//                 <Button variant="outline">Cancel</Button>
//                 <Button variant="destructive" onClick={cancelService}>Confirm Cancellation</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scrollarea';
import { Loader2, RefreshCw, MessageSquare, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAuth } from '../../contexts/authcontext';

interface SMS {
  id: string;
  message: string;
  timestamp: string;
}

interface NumberDetails {
  id: string;
  number: string;
  country: string;
  operator: string;
  service: string;
  status: 'active' | 'expired' | undefined | false;
  refunded: boolean;
}

export default function Sms({ numberId }: { numberId: string }) {
  const [numberDetails, setNumberDetails] = useState<NumberDetails | null>(null);
  const [smsList, setSmsList] = useState<SMS[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { currentUser } = useAuth();

  const fetchSMS = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://smsverify-server.vercel.app/api/get-sms', {
        params: { uid: currentUser?.uid, numberId },
      });

      const smsData = response.data;
      setNumberDetails({
        id: smsData.id,
        number: smsData.phone,
        country: smsData.country,
        operator: 'Unknown',
        service: smsData.product,
        status: smsData.status === 'RECEIVED' ? 'active' : smsData.status === 'PENDING' ? 'active' : smsData.status === 'CANCELED' ? 'expired' : smsData.status === 'TIMEOUT' ? 'expired' : smsData.status === 'FINISHED' ? 'expired' : undefined,
        refunded: smsData.refunded || false,
      });

      const smsMessages = smsData.sms.map((sms: any) => ({
        id: sms.created_at,
        message: sms.text,
        timestamp: sms.date,
      }));
      setSmsList(smsMessages);
    } catch (error) {
      console.error('Error fetching SMS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSMS();
  }, []);

  const requestNewSMS = async () => {
    await fetchSMS();
  };

  const cancelService = () => {
    if (numberDetails) {
      console.log('Service cancelled for number:', numberDetails.number);
      setNumberDetails({ ...numberDetails, status: 'expired' });
    }
  };

  const requestRefund = () => {
    console.log('Requesting refund for number:', numberDetails?.number);
    if (numberDetails) {
      setNumberDetails({ ...numberDetails, refunded: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full ml-28 mr-28">
        <CardHeader>
          <CardTitle className="text-2xl">Your SMS</CardTitle>
          <CardDescription>Number ID: {numberId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {numberDetails && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Number Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <strong>Number:</strong>{' '}
                  <Dialog open={isMessagesOpen} onOpenChange={setIsMessagesOpen}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto font-normal">
                        {numberDetails.number}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                      <DialogHeader>
                        <DialogTitle>Messages for {numberDetails.number}</DialogTitle>
                        <DialogDescription>
                          All SMS messages received for this number.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                        {smsList.length > 0 ? (
                          smsList.map((sms) => (
                            <div key={sms.id} className="mb-4 p-3 bg-gray-100 rounded-lg">
                              <div className="flex items-start space-x-2">
                                <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-800">{sms.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{sms.timestamp}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500">No SMS messages received yet.</p>
                        )}
                      </ScrollArea>
                      <DialogFooter>
                        <Button onClick={() => setIsMessagesOpen(false)}>Close</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </p>
                <p><strong>Country:</strong> {numberDetails.country}</p>
                <p><strong>Operator:</strong> {numberDetails.operator}</p>
                <p><strong>Service:</strong> {numberDetails.service}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <Badge className={`ml-2 ${numberDetails.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {numberDetails.status}
                  </Badge>
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Received SMS</h3>
              <Button onClick={requestNewSMS} disabled={isLoading || numberDetails?.status === 'expired'}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Requesting
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" /> Request New SMS
                  </>
                )}
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {smsList.length > 0 ? (
                smsList.map((sms) => (
                  <div key={sms.id} className="mb-4 p-3 bg-white rounded-lg shadow">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-800">{sms.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{sms.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No SMS messages received yet.</p>
              )}
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="justify-between bg-white">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>

          <Dialog>
            <DialogTrigger asChild>
              {numberDetails && !smsList.length && numberDetails.status === 'active' && !numberDetails.refunded ? (
                <Button variant="destructive">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Cancel Service
                </Button>
              ) : numberDetails?.status === 'expired' && !smsList.length && !numberDetails?.refunded ? (
                <Button variant="default" onClick={requestRefund}>
                  Request Refund
                </Button>
              ) : numberDetails?.refunded ? (
                <p className="text-sm text-gray-500">Refunded</p>
              ) : null}
            </DialogTrigger>

            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Are you sure you want to cancel the service?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. You will lose access to this number and all associated messages.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={cancelService}>Confirm Cancellation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
