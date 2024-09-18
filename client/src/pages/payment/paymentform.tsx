// import { useState } from 'react';
// import { useAuth } from '../../contexts/authcontext';
// import { Button } from '../../components/shadcn/ui/button';
// import stripelogo from '../../images/logo/stripe.png'
// const PaymentForm = () => {
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const { currentUser } = useAuth(); // Get the current user from AuthContext
//    const [amount, setAmount] = useState(0);
  
  
  

//   const handlePayment = async () => {

//     try {
//       // const response = await fetch('http://localhost:3000/api/create-checkout-session', {
//       const response = await fetch('https://smsverify-server.vercel.app/api/create-checkout-session', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           uid: currentUser?.uid, // Replace with actual user ID
//           amount: amount,    // Amount in dollars
//           email: currentUser?.email, // Replace with actual email
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(`Error: ${response.status} - ${response.statusText}`);
//       }

//       const { url } = await response.json();
//       // Redirect to Stripe Checkout
//       window.location.href = url;
//     } catch (error: any) {
//       if (error instanceof Error) {
//         console.error('Unexpected error:', error.message);
//         setErrorMessage(error.message);
//       } else {
//         console.error('Unknown error:', error);
//         setErrorMessage('An unexpected error occurred.');
//       }
//     }
//   };

//   return (
//     // <div className='h-full h-min-full'>
//     //   <Button className=' text-white' onClick={handlePayment}>Pay using Stripe</Button>
//     //   {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//     // </div>
//     <div className="h-full min-h-full flex flex-col items-center justify-center p-4 space-y-4 mb-60">
//     <div className="flex items-center space-x-2">
//       <img
//         src={stripelogo}
//         alt="Stripe Logo"
//         className="h-24 w-auto"
//       />
//       <Button
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
//         onClick={handlePayment}
//       >
//         Pay using Stripe
//       </Button>
//     </div>
//     {errorMessage && (
//       <p className="text-red-500 text-sm">{errorMessage}</p>
//     )}
//   </div>
//   );
// };

// export default PaymentForm;
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authcontext';
import { Button } from '../../components/shadcn/ui/button';
import stripelogo from '../../images/logo/stripe.png';

const PaymentForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [amount, setAmount] = useState<number | ''>(''); // Initialize as empty
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false); // For button validation

  useEffect(() => {
    // Validate the amount (must be greater than 0)
    setIsAmountValid(typeof amount === 'number' && amount > 0);
  }, [amount]);

  const handlePayment = async () => {
    try {
      const response = await fetch('https://smsverify-server.vercel.app/api/create-checkout-session', {
        // const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: currentUser?.uid, // Replace with actual user ID
          amount: amount, // Amount in dollars
          email: currentUser?.email, // Replace with actual email
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const { url } = await response.json();
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      if (error instanceof Error) {
        console.error('Unexpected error:', error.message);
        setErrorMessage(error.message);
      } else {
        console.error('Unknown error:', error);
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
      <div className="flex items-center space-x-2">
        <img src={stripelogo} alt="Stripe Logo" className="h-24 w-auto" />
        <input
          type="number"
          value={amount === '' ? '' : amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
        />
        <Button
          className={`text-white px-4 py-2 rounded-lg shadow-lg transition-colors ${
            isAmountValid
              ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300'
              : 'bg-slate-600' // Dark grey color for disabled button
          }`}
          onClick={handlePayment}
          disabled={!isAmountValid}
        >
          Pay using Stripe
        </Button>
      </div>
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
    </div>
  );
};

export default PaymentForm;
