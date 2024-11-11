
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authcontext';
import { Button } from '../../components/shadcn/ui/button';
import stripelogo from '../../images/logo/stripe.png';
import { useTranslation } from 'react-i18next';

const PaymentForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useAuth(); 
  const [amount, setAmount] = useState<number | ''>(''); 
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false); 
  const {t} = useTranslation();

  useEffect(() => {
    setIsAmountValid(typeof amount === 'number' && amount > 0);
  }, [amount]);

  const handlePayment = async () => {
    try {
      const response = await fetch('https://smsverify-server.vercel.app/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser?.uid,
          amount: amount, 
          email: currentUser?.email, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error: any) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? '' : value);
  };

  return (
    <div className="h-full min-h-full flex flex-col items-center justify-center p-4 space-y-4 mb-60">
      {/* <h2>Pay Using Stripe</h2> */}
      <h2 className="text-4xl font-bold text-blue-600">Pay Using Stripe</h2>

      <div className="flex items-center space-x-2">
        <img src={stripelogo} alt="Stripe Logo" className="h-24 w-auto" />
        <input
          type="number"
          min={1}
          value={amount === '' ? '' : amount}
          onChange={handleAmountChange}
          placeholder={t("payment.Enter amount")}
          className="px-4 py-2 dark:text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
        />
        <Button
          className={`text-white px-4 py-2 rounded-lg shadow-lg transition-colors ${
            isAmountValid
              ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
              : 'bg-slate-600' 
          }`}
          onClick={handlePayment}
          disabled={!isAmountValid}
        >
        {t("payment.Pay using Stripe")}  
        </Button>
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default PaymentForm;
