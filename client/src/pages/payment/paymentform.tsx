import { useState } from 'react';

const PaymentForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkBalance = async (customerId: string) => {
    console.log("checkBalance customerId", customerId);
    try {
      const response = await fetch(`http://localhost:3000/api/check-balance?customerId=${customerId}`);
      const data = await response.json();
      console.log('Customer Balance:', data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };
  
  // Example usage
   checkBalance('cus_QoV6cedIHuDlts');
  
  

  const handlePayment = async () => {
    try {
      const response = await fetch('https://smsverify-server.vercel.app/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: 'abdulmajid', // Replace with actual user ID
          amount: 100,    // Amount in dollars
          email: 'user@example.com', // Replace with actual email
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

  return (
    <div>
      <button onClick={handlePayment}>Pay Now</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default PaymentForm;
