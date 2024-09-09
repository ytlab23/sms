import express from 'express';
import Stripe from 'stripe';
import { db } from './firebase';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const stripe = new Stripe('sk_test_51Ps4ASHiyrduhHMT81gXgjh1HglUaf4PSdxjP9ZWkZFGJBhz5ehjpk4bNxM2YZTT5zHiI42EQ8OROgCKn7CXGLNK007cMxAofs', {
  apiVersion: '2020-08-27',
});

app.use(cors());
app.use(bodyParser.json());

// Create a Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const { uid, amount, email } = req.body;

  try {
    // Fetch customer from Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
   
    let customerId;
    if (userDoc.exists && userDoc.data()?.stripeCustomerId) {
      customerId = userDoc.data()?.stripeCustomerId;
    } else {
      // Create new Stripe customer if one doesn't exist
      const customer = await stripe.customers.create({
        email,
        description: `Customer for user ${uid}`,
      });

      // Save customer ID to Firestore
      await userRef.set({ stripeCustomerId: customer.id }, { merge: true });
      customerId = customer.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Payment',
          },
          unit_amount: amount * 100, // Amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer: customerId,
      success_url: 'http://localhost:5173/',  // Redirect after success
      cancel_url: 'http://localhost:3000/cancel',    // Redirect after cancel
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: error });
  }
});
//webhook for success

// Get Customer Balance
app.get('/api/check-balance', async (req, res) => {
  const { customerId } = req.query;  // Get Stripe customer ID from query parameters

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    // Fetch user from Firestore
    const userRef = db.collection('users').where('stripeCustomerId', '==', customerId);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Assuming there's only one matching document
    const userDoc = snapshot.docs[0].data();
    const balance = userDoc.balance || 0;

    res.json({ balance });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});


// Update customer balance in Firestore after payment confirmation
app.post('/api/update-balance', async (req, res) => {
  const { uid, amount } = req.body;

  try {
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send("User not found");
    }

    const currentBalance = userDoc.data()?.balance || 0;
    const newBalance = currentBalance + amount;

    await userRef.update({ balance: newBalance });

    res.json({ balance: newBalance });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
