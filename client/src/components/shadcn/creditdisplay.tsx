import { Wallet } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authcontext';
import Loader2 from '../../common/loader2';
interface CreditDisplayProps {
  credit: number;
}

export function CreditDisplay({ credit = 0 }: CreditDisplayProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = useAuth();
  // useEffect(() => {

  // });
  useEffect(() => {
    if (!currentUser) return;

    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `https://smsverify-server.vercel.app/api/balance?userId=${currentUser.uid}`,
        );
        console.log(response, '');
        if (!response.ok) {
          setLoading(false);
          throw new Error('Failed to fetch balance.');
        }

        const data = await response.json();
        setBalance(data.balance);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        // setError(err.message);

        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  const formattedCredit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(balance);

  return (
    <Card className="w-full dark:bg-boxdark-2 max-w-[200px] mx-auto transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-md">
      <CardContent className="flex items-center p-1.5">
        <div className="mr-2 p-0.5 bg-green-100 rounded-full">
          <Wallet className="h-3 w-3 text-green-600" aria-hidden="true" />
        </div>
        <div className="flex items-baseline">
          <p className="text-[10px] font-medium text-gray-500 mr-1">Credit:</p>
          {loading && (
            <div className="flex items-center justify-center bg-white">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
            </div>
          )}

          {!loading && (
            <p className="text-xs font-semibold text-gray-900">
              {formattedCredit}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
