

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scrollarea';
import { Loader2, RefreshCw, MessageSquare, AlertCircle, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { useAuth } from '../../contexts/authcontext';
import { toast } from './ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  status: 'active' | 'expired' | 'canceled' | undefined | false;
  refunded: boolean;
}

export default function Sms({ numberId }: { numberId: string }) {
  const [numberDetails, setNumberDetails] = useState<NumberDetails | null>(null);
  const [smsList, setSmsList] = useState<SMS[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();

  const capitalizeFirstLetter = (string: string) => {
    return string.replace(/\b\w/g, (char: string) => char.toUpperCase());
  };

  const fetchSMS = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'https://smsverify-server.vercel.app/api/get-sms',
        {
          params: { uid: currentUser?.uid, numberId },
        },
      );

      const smsData = response.data;
      setNumberDetails({
        id: smsData.id,
        number: smsData.phone,
        country: smsData.country,
        operator: 'Any',
        service: smsData.product,
        status:
          smsData.status === 'RECEIVED'
            ? 'active'
            : smsData.status === 'PENDING'
            ? 'active'
            : smsData.status === 'CANCELED'
            ? 'canceled'
            : smsData.status === 'TIMEOUT'
            ? 'expired'
            : smsData.status === 'FINISHED'
            ? 'expired'
            : undefined,
        refunded: smsData.refunded || false,
      });

      const smsMessages = smsData.sms.map((sms: any) => ({
        id: sms.created_at,
        message: sms.text,
        timestamp: sms.date,
      }));
      setSmsList(smsMessages);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch SMS data. Please try again.',
      });
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
  const requestRefund = async (id: string) => {
    try {
      
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/refund',
        {
          uid: currentUser?.uid,
          numberId: id,
        },
      );

      if (response.status === 200) {
      
        if (numberDetails) {
          setNumberDetails({ ...numberDetails, refunded: true });
        }

        toast({
          variant: 'success',
          title: 'Refund processed',
          description: 'The refund has been processed successfully.',
        });
        navigate('/orders');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Refund failed',
        description: 'Failed to process the refund. Please try again later.',
      });
    }
  };

  const cancelService = async (id: string) => {
    try {
      const response = await axios.post(
        'https://smsverify-server.vercel.app/api/cancel',
        {
          uid: currentUser?.uid,
          numberId: id,
        },
      );

      if (response.status === 200) {
        if (numberDetails) {
          setNumberDetails({ ...numberDetails, status: 'canceled' });
        }
        toast({
          variant: 'success',
          title: 'Service canceled',
          description: 'The service has been canceled successfully.',
        });
        navigate('/orders');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Cancellation failed',
        description: 'Failed to cancel the service. Please try again later.',
      });
    }
  };

  const copyNumberToClipboard = () => {
    if (numberDetails?.number) {
      navigator.clipboard.writeText(numberDetails.number)
        .then(() => {
          toast({
            variant: 'success',
            title: 'Number copied',
            description: 'The number has been copied to your clipboard.',
          });
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Copy failed',
            description: 'Failed to copy the number. Please try again.',
          });
        });
    }
  };

  const showRefundButton = numberDetails?.status === 'expired' && !smsList.length && !numberDetails?.refunded;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl font-bold">{t("sms.SMS")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6 dark:bg-boxdark">
          {numberDetails && (
            <div className="bg-white dark:bg-boxdark-2 p-6 rounded-lg shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h3 className="text-xl font-semibold mb-2 sm:mb-0">{t("sms.Number Details")}</h3>
                <Badge
                  className={`${
                    numberDetails.status === 'active'
                      ? 'bg-green-500 hover:bg-green-600'
                      : numberDetails.status === 'canceled'
                      ? 'bg-yellow-500 hover:bg-yellow-600'
                      : 'bg-red-500 hover:bg-red-600'
                  } text-white px-3 py-1 rounded-full text-sm font-medium`}
                >
                  {capitalizeFirstLetter(numberDetails.status || '')}
                </Badge>
              </div>
              <div className="grid dark:bg-boxdark-2 grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between sm:justify-start">
                  <span className="font-medium text-gray-600">{t("sms.Number")}:</span>
                  <div className="flex items-center ml-2">
                    <span className="text-primary font-semibold">{numberDetails.number}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 p-1 text-primary hover:text-primary-dark"
                      onClick={copyNumberToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600">{t("sms.Country")}:</span>
                  <span className="ml-2">{capitalizeFirstLetter(numberDetails.country)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Service:</span>
                  <span className="ml-2">{capitalizeFirstLetter(numberDetails.service)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 ">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-semibold mb-2 sm:mb-0">{t("sms.Received SMS")}</h3>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 ">
                {numberDetails?.status === 'active' && (
                  <Button
                    onClick={requestNewSMS}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("sms.Requesting")} 
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" /> {t("sms.Request New SMS")} 
                      </>
                    )}
                  </Button>
                )}
                {numberDetails &&
                  !smsList.length &&
                  numberDetails.status === 'active' && (
                    <Button
                      variant="destructive"
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => setIsCancelDialogOpen(true)}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {t("sms.Cancel Service")}   
                    </Button>
                  )}
                {/* {showRefundButton && (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      if (numberDetails?.id) {
                        requestRefund(numberDetails.id);
                      }

                    }}
                  >
                    Request Refund
                  </Button>
                )} */}
              </div>
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-white dark:bg-boxdark-2">
              {smsList.length > 0 ? (
                smsList.map((sms) => (
                  <div
                    key={sms.id}
                    className="mb-4 p-3 bg-gray-50 rounded-lg shadow"
                  >
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="text-sm text-gray-800">{sms.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {sms.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
               {t("sms.No SMS messages received yet.")}   
                </p>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>{t("sms.Are you sure you want to cancel the service?")} </DialogTitle>
            <DialogDescription>{t("sms.This action cannot be undone. You won't receive SMS to this number again.")}
              
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
            className='bg-blue-600 text-white hover:bg-blue-700'
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
          {t("sms.No, keep the service")}    
            </Button>
            <Button
            className='bg-red-600 text-white hover:bg-red-700'
              variant="destructive"
              onClick={() => {
                if (numberDetails?.id) {
                  cancelService(numberDetails.id);
                  setIsCancelDialogOpen(false);
                }
              }}
            >
                      {t("sms.Yes, cancel the service")}  
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}