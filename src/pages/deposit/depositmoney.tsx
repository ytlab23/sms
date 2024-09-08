import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { auth, db } from './../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

const DepositMoney: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(5000); // Default $50
  const [isFetchingCustomerId, setIsFetchingCustomerId] = useState(true);

  // Fetch or create Stripe customer ID
  useEffect(() => {
    const fetchCustomerId = async () => {
      setIsFetchingCustomerId(true);
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            const stripeCustomerId = data?.stripeCustomerId;

            if (stripeCustomerId) {
              setCustomerId(stripeCustomerId);
            } else {
              // If no Stripe customer ID exists, create one
              const response = await fetch('/local-api/create-customer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, uid: user.uid }),
              });
              
              console.log('Creating Stripe customer...',response);
              const { customerId: newCustomerId } = await response.json();
              setCustomerId(newCustomerId);
            }
          }
        } catch (error) {
          console.error("Error fetching customer ID:", error);
        } finally {
          setIsFetchingCustomerId(false);
        }
      }
    };

    fetchCustomerId();
  }, []);

  // const handleDeposit = async () => {
  //   setLoading(true);

  //   try {
  //     // Check if the user is authenticated
  //     const user = auth.currentUser;
  //     if (!user) {
  //       throw new Error('User not authenticated');
  //     }

  //     // Ensure we have the Stripe customer ID
  //     if (!customerId) {
  //       throw new Error('Customer ID missing');
  //     }

  //     // Define the deposit amount (e.g., $50 -> 5000 cents)
  //     const amount = 5000;

  //     // Send a request to the backend to create a Stripe checkout session
  //     const response = await fetch('/api/create-checkout-session', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ uid: user.uid, amount }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create checkout session');
  //     }

  //     const { sessionId } = await response.json();

  //     // Load the Stripe object and redirect to Checkout
  //     const stripe = await stripePromise;
  //     const { error } = await stripe?.redirectToCheckout({ sessionId }) ?? {};

  //     if (error) {
  //       console.error('Stripe Checkout error:', error);
  //     }
  //   } catch (error) {
  //     console.error('Deposit error:', error);
  //     alert(`Error: ${error}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleDeposit = async () => {
    setLoading(true);
  
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      if (!customerId) {
        throw new Error('Customer ID missing');
      }
  
      const amount = 5000; // Example amount in cents
  
      const formBody = new URLSearchParams({
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || '',
        phone: user.phoneNumber || '',
        description: 'Deposit description'
      }).toString();
  
      const response = await fetch('/api/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });
  
      if (!response.ok) {
        throw new Error('Failed to create customer');
      }
  
      const { customerId: newCustomerId } = await response.json();
      setCustomerId(newCustomerId);
      
      // Create a checkout session
      const sessionResponse = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, amount }),
      });
  
      if (!sessionResponse.ok) {
        throw new Error('Failed to create checkout session');
      }
  
      const { sessionId } = await sessionResponse.json();
      const stripe = await stripePromise;
      const { error } = await stripe?.redirectToCheckout({ sessionId }) ?? {};
  
      if (error) {
        console.error('Stripe Checkout error:', error);
      }
    } catch (error) {
      console.error('Deposit error:', error);
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Deposit Money</h2>

      {/* Display loading while fetching or creating customer ID */}
      {isFetchingCustomerId ? (
        <p>Loading customer info...</p>
      ) : (
        <>
          <label>
            Amount (in cents):
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="100"
              step="100"
            />
          </label>
          <button onClick={handleDeposit} >
           pay {loading ? 'Processing...' : `Deposit $${amount / 100}`}
          </button>
        </>
      )}
    </div>
  );
};

export default DepositMoney;
