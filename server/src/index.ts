import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from './firebase'; // Make sure firebase.ts exports the correctly initialized Firestore db
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const stripe = new Stripe('sk_test_51Ps4ASHiyrduhHMT81gXgjh1HglUaf4PSdxjP9ZWkZFGJBhz5ehjpk4bNxM2YZTT5zHiI42EQ8OROgCKn7CXGLNK007cMxAofs', {
  apiVersion: '2020-08-27',
});

app.use(cors());
// app.use(bodyParser.json());
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === '/api/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
  }
);

interface CheckBalanceResult {
  userRef: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
  currentBalance: number;
}




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
      await userRef.set({ stripeCustomerId: customer.id, balance: 0 }, { merge: true });
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



app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_b8d5afa9222183584c6d1edb7b7d3698b36205222734b1a000451bbee0e0965f';
    if (!sig) {
      console.error('Webhook signature is missing.');
      return res.sendStatus(400);
    }

    let event;

    try {
      // Construct the event using the raw body and signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Constructed Event:', event);
    } catch (err) {
      console.error('Webhook signature verification failed:', (err as Error).message);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { customer, amount_received } = paymentIntent;

        try {
          // Assuming Firestore is set up via admin SDK
          // const db = admin.firestore();
          
          // Find user with matching Stripe customer ID
          const userSnapshot = await db
            .collection('users')
            .where('stripeCustomerId', '==', customer)
            .get();

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userRef = db.collection('users').doc(userDoc.id);
            const currentBalance = userDoc.data().balance || 0;

            // Update balance in Firestore
            await userRef.update({
              balance: currentBalance + amount_received / 100,
            });

            console.log(
              `Balance updated for customer ${customer}: ${currentBalance + amount_received / 100}`
            );
          } else {
            console.log(`No user found for customer ${customer}`);
          }
        } catch (error) {
          console.error('Error updating user balance:', (error as Error).message);
          return res.status(500).send(`Server Error: ${(error as Error).message}`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);



//get sservices

app.get('/api/get-services', async (req: Request, res: Response) => {
  try {
    const apiKey = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg";

    if (!apiKey) {
      console.error('API key is not set.');
      return res.status(500).json({ error: 'API key is missing' });
    }

    console.log('Fetching available services from 5sim');

    const response = await axios.get('https://5sim.net/v1/guest/products/any/any', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg`,
      },
    });

    // console.log('Services fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching services:', error );
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});
app.get('/api/countries', async (req, res) => {
  try {
    const response = await axios.get('https://5sim.net/v1/guest/countries', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SIM_API_KEY}`, // Load API key from env
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});
//get operators
app.get('/api/get-operators', async (req: Request, res: Response) => {
  const { country, service } = req.query;

  try {
    console.log('Fetching operators for:', { country, service });

    const response = await axios.get(`https://5sim.net/v1/guest/operators/${country}/${service}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg`,
      },
    });

    console.log('Operators fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching operators:', error);
    res.status(500).json({ error: 'Failed to fetch operators' });
  }
});
//get operators
const checkBalance = async (uid: string, cost: number): Promise<CheckBalanceResult> => {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User not found');
  }

  const currentBalance = userDoc.data()?.balance || 0;
  if (currentBalance < cost) {
    throw new Error('Insufficient balance');
  }

  return { userRef, currentBalance };
};

// Buy a specific product from 5sim
app.post('/api/buy-product', async (req: Request, res: Response) => {
  const { uid, country, operator, product } = req.body;

  try {
    console.log('Received request to buy product:', { uid, country, operator, product });

    // Step 1: Check if the user has enough balance
    const { userRef, currentBalance } = await checkBalance(String(uid), 1.0); // Replace 1.0 with the actual product cost
    console.log('User balance validated:', { uid, currentBalance });

    // Step 2: Purchase a number from 5sim API
    const url = `https://5sim.net/v1/user/buy/activation/ethiopia/any/telegram`;
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
        'Accept': 'application/json',
      },
    });

    const purchasedNumber = response.data;
    console.log('Number purchased successfully:', purchasedNumber,response);

    // Step 3: Save purchased number information to Firestore
    //dude fix it
    await userRef.collection('products').add({
      ...purchasedNumber,
      purchaseDate: new Date(),
    });
    console.log('Product information saved to Firestore');

    // Step 4: Deduct cost from the user's balance
    const newBalance = currentBalance - 1.0; // Replace 1.0 with the actual product cost
    await userRef.update({ balance: newBalance });
    console.log('User balance updated:', { newBalance });

    res.json({ message: 'Product purchased successfully', product: purchasedNumber });
  } catch (error) {
    console.error('Error purchasing product:', error);
    res.status(500).json({ error: error || 'Failed to purchase product' });
  }
});

// Get user's purchased products
app.get('/api/get-user-products', async (req: Request, res: Response) => {
  const { uid } = req.query;

  try {
    console.log('Fetching products for user:', uid);

    const userRef = db.collection('users').doc(String(uid));
    const productsSnapshot = await userRef.collection('products').get();

    if (productsSnapshot.empty) {
      console.log('No products found for user:', uid);
      return res.status(404).json({ message: 'No products found for user' });
    }

    const products = productsSnapshot.docs.map((doc) => doc.data());
    console.log('Products fetched successfully:', products);

    res.json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get SMS for a specific product or number
app.get('/api/get-sms', async (req: Request, res: Response) => {
  const { uid, numberId } = req.query;

  try {
    console.log('Fetching SMS for user:', { uid, numberId });

    const userRef = db.collection('users').doc(String(uid));
    const productsSnapshot = await userRef.collection('products').where('id', '==', numberId).get();

    if (productsSnapshot.empty) {
      console.log('No product found for user with this number ID:', numberId);
      return res.status(404).json({ message: 'No such product found for user' });
    }

    // Fetch SMS from 5sim API
    const response = await axios.get(`https://5sim.net/v1/user/check/${numberId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VITE_APP_5SIM_API_KEY}`,
      },
    });

    console.log('SMS fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching SMS:', error);
    res.status(500).json({ error: 'Failed to fetch SMS' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
