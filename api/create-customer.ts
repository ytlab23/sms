import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

if (!admin.apps.length) {
  admin.initializeApp();
}

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    console.log('Method Not Allowed');
    return res.status(405).send({ error: 'Method Not Allowed' });
  }

  const { email, uid } = req.body;

  console.log('Received request:', { email, uid });

  try {
    const customer = await stripe.customers.create({ email });

    await admin.firestore().collection('users').doc(uid).set(
      { stripeCustomerId: customer.id },
      { merge: true }
    );

    console.log('Customer created:', customer.id);

    return res.status(200).json({ customerId: customer.id });
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
};
