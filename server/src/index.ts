import express, { Request, Response } from "express";
import Stripe from "stripe";
import { db } from "./firebase"; 
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { error } from "console";
import admin from "firebase-admin";

const app = express();
const stripe = new Stripe(
  "sk_test_51Ps4ASHiyrduhHMT81gXgjh1HglUaf4PSdxjP9ZWkZFGJBhz5ehjpk4bNxM2YZTT5zHiI42EQ8OROgCKn7CXGLNK007cMxAofs",
  {
    apiVersion: "2020-08-27",
  }
);

app.use(cors());
app.set("trust proxy", true);

app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    if (req.originalUrl === "/api/webhook") {
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

app.post("/api/create-checkout-session", async (req, res) => {
  const { uid, amount, email } = req.body;

  try {
    
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let customerId;
    if (userDoc.exists && userDoc.data()?.stripeCustomerId) {
      customerId = userDoc.data()?.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email,
        description: `Customer for user ${uid}`,
      });

      await userRef.set(
        { stripeCustomerId: customer.id, balance: 0 },
        { merge: true }
      );
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Payment",
            },
            unit_amount: amount * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer: customerId,
      success_url: "https://sms-verify-two.vercel.app/paymentsuccess", 
      cancel_url: "https://sms-verify-two.vercel.app/paymentfailure", 
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = "whsec_YiDJzH6zKu5KAu602yHQFntMReE3ZcHH";
    if (!sig) {
      console.error("Webhook signature is missing.");
      return res.sendStatus(400);
    }

    let event;

    try {
      // Construct the event using the raw body and signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log("Constructed Event:", event);
    } catch (err) {
      console.error(
        "Webhook signature verification failed:",
        (err as Error).message
      );
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { customer, amount_received } = paymentIntent;

        try {
          // Assuming Firestore is set up via admin SDK
          // const db = admin.firestore();

          // Find user with matching Stripe customer ID
          const userSnapshot = await db
            .collection("users")
            .where("stripeCustomerId", "==", customer)
            .get();

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userRef = db.collection("users").doc(userDoc.id);
            const currentBalance = userDoc.data().balance || 0;

            // Update balance in Firestore
            await userRef.update({
              balance: currentBalance + amount_received / 100,
            });

            console.log(
              `Balance updated for customer ${customer}: ${
                currentBalance + amount_received / 100
              }`
            );
          } else {
            console.log(`No user found for customer ${customer}`);
          }
        } catch (error) {
          console.error(
            "Error updating user balance:",
            (error as Error).message
          );
          return res
            .status(500)
            .send(`Server Error: ${(error as Error).message}`);
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Route to request user balance
app.get("/api/balance", async (req, res) => {
  try {
    // Assuming you get the user ID or stripeCustomerId from the request (e.g., req.query or req.headers)
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Find the user in Firestore by userId
    const userSnapshot = await db.collection("users").doc(userId).get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: "User not found." });
    }

    const userData = userSnapshot.data();
    const userBalance = userData?.balance || 0;

    res.json({ balance: userBalance });
  } catch (error) {
    console.error("Error fetching user balance:", error as Error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

//get sservices

app.get("/api/get-services", async (req: Request, res: Response) => {
  const { country } = req.query;
  console.log("Fetching services for country:", country);
  try {
    const apiKey =
      "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg";

    if (!apiKey) {
      console.error("API key is not set.");
      return res.status(500).json({ error: "API key is missing" });
    }

    console.log("Fetching available services from 5sim");

    const response = await axios.get(
      `https://5sim.net/v1/guest/products/${country}/any`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg`,
        },
      }
    );

    // console.log('Services fetched successfully:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});
app.get("/api/countries", async (req, res) => {
  try {
    const response = await axios.get("https://5sim.net/v1/guest/countries", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SIM_API_KEY}`, // Load API key from env
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});
//get operators
app.get("/api/get-operators", async (req: Request, res: Response) => {
  const { country, service } = req.query;

  console.log("Fetching operators for:", { country, service });

  try {
    console.log("Fetching operators for:", { country, service });

    const response = await axios.get(
      `https://5sim.net/v1/guest/prices?country=${country}&product=${service}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTYzOTM4OTYsImlhdCI6MTcyNDg1Nzg5NiwicmF5IjoiNjYxODEyYTM5OGQyZWFlNjY2MThkZGRlZGQ4ODUxODMiLCJzdWIiOjI2OTcyODN9.LjwOqrC_mmKS_BnVSSv4KFiBvcd11EJYBsZpjTkoh4P8vYQYgJdQ7T8dO7q8bYkZdr5pcpBxKIRMO8IhFoxaMOgHZWIzEA7Mafb6LJWyq-FsE5BM8MoNfLpfh_vHxp1iGNX2zt4Nv99Qix0lY3GvwdiiKhOu31U_9TrXD0W0EOydXDnMgeqtht8hMjfxx9uv87AGTr9up7d51S6t1flOHA92a3R9rHJI6BLttZskixQQamCPUIskD3C-gvvk0ujvLZMc8Gh94j00hcwLPMt0f6gjH7RBsyGztg0KrrBcRchJklp7C7Y1n7HXaDtW5CE9dtt9Hn0l2MLvymN0tKYQDg`,
        },
      }
    );

    console.log("Operators fetched successfully:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching operators:", error);
    res.status(500).json({ error: "Failed to fetch operators" });
  }
});
//get operators

const checkBalance = async (
  uid: string,
  cost: number
): Promise<CheckBalanceResult> => {
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    // throw new Error('User not found');
    const error = new Error("Insufficient balance");
    error.name = "InsufficientBalanceError"; // Custom error name to handle it specifically
    throw error;
  }

  const currentBalance = userDoc.data()?.balance || 0;
  if (currentBalance < cost) {
    const error = new Error("Insufficient balance");
    error.name = "InsufficientBalanceError"; // Custom error name to handle it specifically
    throw error;
  }

  return { userRef, currentBalance };
};

// Fetch product price from 5sim API
// const getProductPrice = async (country: string, product: string, operator: string): Promise<number> => {
//   const priceUrl = `https://5sim.net/v1/guest/prices?country=${country}&product=${product}`;
//   const response = await axios.get(priceUrl, {
//     headers: {
//       'Accept': 'application/json',
//     },
//   });

//   const productData = response.data[country]?.[product]?.[operator];
//   if (!productData || productData.cost === undefined) {
//     throw new Error(`Price for ${operator} not found`);
//   }

//   return productData.cost;
// };
// Fetch product price from Firestore
const getProductPrice = async (
  country: string,
  product: string
): Promise<number> => {
  try {
    // Step 1: Fetch country-specific price
    const serviceDocId = `${country}_${product}`;
    const serviceDocRef = db.collection("pricing").doc(serviceDocId);
    const docSnap = await serviceDocRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      console.log(`Country-specific price found: ${data?.price}`);
      if (data?.price !== undefined) {
        return data.price;
      }
    }

    // Step 2: Fetch default product price if country-specific price is not found
    const defaultServiceDocRef = db.collection("services").doc(product); // Check collection path
    const defaultDocSnap = await defaultServiceDocRef.get();

    if (defaultDocSnap.exists) {
      const defaultData = defaultDocSnap.data();
      console.log(`Default price found for ${product}: ${defaultData?.price}`);
      if (defaultData?.price !== undefined) {
        return defaultData.price;
      }
    }

    // Step 3: If price not found, log an error and throw an exception
    console.log(`Default document data for ${product}:`, defaultDocSnap.data());
    throw new Error(`Price for ${product} not found`);
  } catch (error) {
    console.error("Error fetching product price:", error);
    throw new Error("Unable to fetch product price");
  }
};

// Buy a specific product from 5sim

// app.post('/api/buy-product', async (req: Request, res: Response) => {
//   const { uid, country, operator, product } = req.body;
//   console.log(country, operator, product);

//   try {
//     console.log('Received request to buy product:', { uid, country, operator, product });

//     // Step 1: Fetch the price of the product from 5sim
//     const productCost = await getProductPrice(country, product, operator);
//     console.log('Product price fetched:', { productCost });

//     // Step 2: Check if the user has enough balance
//     const { userRef, currentBalance } = await checkBalance(String(uid), productCost);
//     console.log('User balance validated:', { uid, currentBalance });

//     // Step 3: Purchase a number from 5sim API
//     const url = `https://5sim.net/v1/user/buy/activation/${country}/any/${product}`;
//     const purchaseResponse = await axios.get(url, {
//       headers: {
//         'Authorization': `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
//         'Accept': 'application/json',
//       },
//     });

//     const purchasedNumber = purchaseResponse.data;
//     console.log('Number purchased successfully:', purchasedNumber);

//     // Step 4: Save purchased number information to Firestore using the number ID as the document ID
//     await userRef.collection('products').doc(purchasedNumber.id.toString()).set({
//       ...purchasedNumber,
//       purchaseDate: new Date(),
//       refunded: false,
//     });
//     console.log('Product information saved to Firestore');

//     // Step 5: Deduct cost from the user's balance
//     const newBalance = currentBalance - productCost;
//     await userRef.update({ balance: newBalance });
//     console.log('User balance updated:', { newBalance });

//     res.json({ message: 'Product purchased successfully', product: purchasedNumber });
//   } catch (error) {
//     if ((error as Error).name === 'InsufficientBalanceError') {
//       console.error('Insufficient balance:', (error as Error).message);
//       return res.status(402).json({ error: 'Insufficient balance. Please top up your account.' });
//     }

//     console.error('Error purchasing product:', error);
//     res.status(500).json({ error: (error as Error).message || 'Failed to purchase product' });
//   }
// });

// Get user's purchased products
app.post("/api/buy-product", async (req: Request, res: Response) => {
  const { uid, country, product } = req.body; // Removed operator field
  console.log(country, product);

  try {
    console.log("Received request to buy product:", { uid, country, product });

    // Step 1: Fetch the price of the product from Firestore
    const productCost = await getProductPrice(country, product); // Adjusted to only use country and product
    console.log("Product price fetched:", { productCost });

    // Step 2: Check if the user has enough balance
    const { userRef, currentBalance } = await checkBalance(
      String(uid),
      productCost
    );
    console.log("User balance validated:", { uid, currentBalance });

    // Step 3: Purchase a number from 5sim API (without operator field)
    const url = `https://5sim.net/v1/user/buy/activation/${country}/any/${product}`;
    const purchaseResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
        Accept: "application/json",
      },
    });

    const purchasedNumber = purchaseResponse.data;
    console.log("Number purchased successfully:", purchasedNumber);

    // Step 4: Save purchased number information to Firestore
    await userRef
      .collection("products")
      .doc(purchasedNumber.id.toString())
      .set({
        ...purchasedNumber,
        purchaseDate: new Date(),
        refunded: false,
        updatedPrice: productCost,
      });

    console.log("Product information saved to Firestore");

    // Step 5: Deduct cost from the user's balance
    const newBalance = currentBalance - productCost;
    await userRef.update({ balance: newBalance });
    console.log("User balance updated:", { newBalance });

    res.json({
      message: "Product purchased successfully",
      product: purchasedNumber,
    });
  } catch (error) {
    if ((error as Error).name === "InsufficientBalanceError") {
      console.error("Insufficient balance:", (error as Error).message);
      return res
        .status(402)
        .json({ error: "Insufficient balance. Please top up your account." });
    }

    console.error("Error purchasing product:", error);
    res
      .status(500)
      .json({
        error: (error as Error).message || "Failed to purchase product",
      });
  }
});

app.get("/api/get-user-products", async (req: Request, res: Response) => {
  const { uid } = req.query;

  try {
    console.log("Fetching products for user:", uid);

    const userRef = db.collection("users").doc(String(uid));
    const productsSnapshot = await userRef.collection("products").get();

    if (productsSnapshot.empty) {
      console.log("No products found for user:", uid);
      return res.status(404).json({ message: "No products found for user" });
    }

    const products = productsSnapshot.docs.map((doc) => doc.data());
    console.log("Products fetched successfully:", products);

    res.json(products);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get SMS for a specific product or number

app.get("/api/get-sms", async (req: Request, res: Response) => {
  const { uid, numberId } = req.query;

  if (!uid || !numberId) {
    return res.status(400).json({ error: "Missing uid or numberId" });
  }

  try {
    console.log("Fetching SMS for user:", { uid, numberId });

    // Fetch SMS from 5sim API
    console.log(process.env.SIM_API_KEY, "api key");
    const response = await axios.get(
      `https://5sim.net/v1/user/check/${numberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
        },
      }
    );

    console.log("SMS fetched successfully:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching SMS:", error);
    res.status(500).json({ error: "Failed to fetch SMS" });
  }
});

app.post("/api/cancel", async (req: Request, res: Response) => {
  const { uid, numberId } = req.body;

  // Ensure numberId is treated as a string and trim it
  const trimmedUid = uid?.trim();
  const trimmedNumberId = String(numberId)?.trim();

  // Check for missing or invalid values
  if (!trimmedUid || !trimmedNumberId || trimmedNumberId === "") {
    console.log("uid:", uid, "numberId:", numberId);
    console.log(
      "Trimmed uid:",
      trimmedUid,
      "Trimmed numberId:",
      trimmedNumberId
    );
    console.log("Invalid uid or numberId provided");
    return res
      .status(400)
      .json({ error: "Missing or invalid uid or numberId" });
  }

  try {
    console.log("uid:", trimmedUid, "numberId:", trimmedNumberId);

    // Fetch purchased product details from Firestore
    const userRef = db.collection("users").doc(trimmedUid);
    const productDoc = await userRef
      .collection("products")
      .doc(trimmedNumberId)
      .get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = productDoc.data();
    if (!productData) {
      return res.status(404).json({ error: "Product data not found" });
    }

    const isExpired = new Date() > new Date(productData.expires);
    if (productData.sms || productData.refunded || isExpired) {
      console.log("Product not eligible for cancellation:", productData);
      return res
        .status(400)
        .json({ error: "Product not eligible for cancellation" });
    }

    // Call 5sim API to cancel the number
    const cancelResponse = await axios.get(
      `https://5sim.net/v1/user/cancel/${trimmedNumberId}`,
      {
        headers: {
          Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
          Accept: "application/json",
        },
      }
    );

    if (cancelResponse.status === 200) {
      // Refund the balance to the user
      // const productCost = await getProductPrice(productData.country, productData.product);
      const productCost = productData.updatedPrice;
      const userDoc = await userRef.get();
      const userBalance = userDoc.data()?.balance || 0;
      const newBalance = userBalance + productCost;
      console.log(newBalance, "is the new balance");

      // Update user's balance in Firestore
      await userRef.update({ balance: newBalance });

      // Mark the product as refunded
      await userRef
        .collection("products")
        .doc(trimmedNumberId)
        .update({ refunded: true });

      console.log("Service canceled and balance refunded");
      res.json({
        message: "Service canceled and balance refunded",
        newBalance,
      });
    } else {
      console.log("5sim API error:", cancelResponse.data);
      throw new Error("Failed to cancel the number via 5sim");
    }
  } catch (error) {
    console.error("Error canceling product:", error);
    res.status(500).json({ error: "Failed to cancel product" });
  }
});

// Refund Route
// app.post('/api/refund', async (req: Request, res: Response) => {
//   const { uid, numberId } = req.body;

//   // Ensure numberId is treated as a string and trim it
//   const trimmedUid = uid?.trim();
//   const trimmedNumberId = String(numberId)?.trim();

//   // Check for missing or invalid values
//   if (!trimmedUid || !trimmedNumberId || trimmedNumberId === '') {
//     console.log('uid:', uid, 'numberId:', numberId);
//     console.log('Trimmed uid:', trimmedUid, 'Trimmed numberId:', trimmedNumberId);
//     return res.status(400).json({ error: 'Missing or invalid uid or numberId' });
//   }

//   try {
//     // Fetch purchased product details
//     const userRef = db.collection('users').doc(trimmedUid);
//     const productDoc = await userRef.collection('products').doc(trimmedNumberId).get();

//     if (!productDoc.exists) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     const productData = productDoc.data();
//     if (!productData) {
//       return res.status(404).json({ error: 'Product data not found' });
//     }

//     const isExpired = new Date() > new Date(productData.expires);
//     if (!isExpired || productData.sms || productData.refunded) {
//       console.log('Product not eligible for refund:', productData);
//       return res.status(400).json({ error: 'Product not eligible for refund' });
//     }

//     // Refund the balance to the user
//     // const productCost = await getProductPrice(productData.country, productData.product);
//     const productCost = productData.updatedPrice;

//     const userDoc = await userRef.get();
//     const userBalance = userDoc.data()?.balance || 0; // Fetch balance from user data
//     const newBalance = userBalance + productCost;

//     await userRef.update({ balance: newBalance });

//     // Mark the product as refunded
//     await userRef.collection('products').doc(trimmedNumberId).update({ refunded: true });

//     console.log('Balance refunded');
//     res.json({ message: 'Balance refunded', newBalance });
//   } catch (error) {
//     console.error('Error refunding product:', error);
//     res.status(500).json({ error: 'Failed to refund product' });
//   }
// });

app.post("/api/refund", async (req: Request, res: Response) => {
  const { uid, numberId } = req.body;

  // Ensure numberId is treated as a string and trim it
  const trimmedUid = uid?.trim();
  const trimmedNumberId = String(numberId)?.trim();

  // Check for missing or invalid values
  if (!trimmedUid || !trimmedNumberId || trimmedNumberId === "") {
    console.log("uid:", uid, "numberId:", numberId);
    console.log(
      "Trimmed uid:",
      trimmedUid,
      "Trimmed numberId:",
      trimmedNumberId
    );
    return res
      .status(400)
      .json({ error: "Missing or invalid uid or numberId" });
  }

  let productData: any;

  try {
    // Fetch purchased product details
    const userRef = db.collection("users").doc(trimmedUid);
    const productDoc = await userRef
      .collection("products")
      .doc(trimmedNumberId)
      .get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: "Product not found" });
    }

    productData = productDoc.data();
    if (!productData) {
      return res.status(404).json({ error: "Product data not found" });
    }

    const country = productData.country;
    const service = productData.product;
    const countryServiceKey = `${country}_${service}`; // Combine country and service

    // Reference to the statistics document
    const statisticsRef = db.collection("statistics").doc(countryServiceKey);

    // Initialize missing fields if they don't exist
    const statisticsSnapshot = await statisticsRef.get();
    if (!statisticsSnapshot.exists) {
      await statisticsRef.set({
        successfulRefunds: 0,
        unsuccessfulRefunds: 0,
      });
    }

    // Check product eligibility for refund
    const isExpired = new Date() > new Date(productData.expires);
    if (!isExpired || productData.sms || productData.refunded) {
      console.log("Product not eligible for refund:", productData);

      // Increment unsuccessful refund count and ensure successfulRefunds exists
      await statisticsRef.set(
        {
          unsuccessfulRefunds: FieldValue.increment(1),
          successfulRefunds: statisticsSnapshot.data()?.successfulRefunds || 0, // Initialize to 0 if not present
        },
        { merge: true }
      );

      return res.status(400).json({ error: "Product not eligible for refund" });
    }

    // Refund the balance to the user
    const productCost = productData.updatedPrice;
    const userDoc = await userRef.get();
    const userBalance = userDoc.data()?.balance || 0;
    const newBalance = userBalance + productCost;

    await userRef.update({ balance: newBalance });

    // Mark the product as refunded
    await userRef
      .collection("products")
      .doc(trimmedNumberId)
      .update({ refunded: true });

    // Increment successful refund count and ensure unsuccessfulRefunds exists
    await statisticsRef.set(
      {
        successfulRefunds: FieldValue.increment(1),
        unsuccessfulRefunds:
          statisticsSnapshot.data()?.unsuccessfulRefunds || 0, // Initialize to 0 if not present
      },
      { merge: true }
    );

    console.log("Balance refunded");
    res.json({ message: "Balance refunded", newBalance });
  } catch (error) {
    console.error("Error refunding product:", error);

    // Increment unsuccessful refund count in case of an error
    if (productData) {
      const country = productData.country;
      const service = productData.product;
      const countryServiceKey = `${country}_${service}`;
      const statisticsRef = db.collection("statistics").doc(countryServiceKey);

      const statisticsSnapshot = await statisticsRef.get();
      if (!statisticsSnapshot.exists) {
        await statisticsRef.set({
          successfulRefunds: 0,
          unsuccessfulRefunds: 0,
        });
      }

      await statisticsRef.set(
        {
          unsuccessfulRefunds: FieldValue.increment(1),
          successfulRefunds: statisticsSnapshot.data()?.successfulRefunds || 0, // Initialize to 0 if not present
        },
        { merge: true }
      );
    }

    res.status(500).json({ error: "Failed to refund product" });
  }
});

//UNTESTED

app.get("/api/check-free-number", async (req: Request, res: Response) => {
  // Capture the user IP from query parameters
  const userIp = req.query.ip?.toString() || req.ip;
  const uid = req.query.uid?.toString() || "";
  console.log(uid, "uid", userIp, "userIp", req.query);

  try {
    // Check if the IP has already claimed a free number
    const ipRef = db.collection("ip_addresses").doc(userIp || "");
    const ipDoc = await ipRef.get();

    // Check if the user ID has already claimed a free number
    const userRef = db.collection("claimed_users").doc(uid as string);
    const userDoc = await userRef.get();


    

    if (ipDoc.exists || userDoc.exists) {
      return res
        .status(403)
        .json({
          eligible: false,
          message: "You have already claimed your free number",
        });
    }

    // The user is eligible for a free number
    res.json({ eligible: true, message: "You are eligible for a free number" });
  } catch (error) {
    console.error("Error checking free number eligibility:", error);
    res.status(500).json({ error: "Failed to check free number eligibility" });
  }
});

// app.post('/api/claim-free-number', async (req: Request, res: Response) => {
//   const { uid, country, product, userIp } = req.body;

//   // Log the received values for debugging
//   console.log(userIp, "userIp", uid, "uid", country, "country", product, "product");

//   // Validate that userIp and uid are properly defined
//   if (!userIp) {
//     return res.status(400).json({ error: 'Invalid request: Missing user IP' });
//   }

//   if (!uid) {
//     return res.status(400).json({ error: 'Invalid request: Missing user ID' });
//   }

//   try {
//     // Step 1: Check if the user IP or user ID has already claimed a free number
//     const ipRef = db.collection('ip_addresses').doc(userIp); // No need for a fallback, check is done above
//     const ipDoc = await ipRef.get();

//     const userRef = db.collection('claimed_users').doc(uid);
//     const userDoc = await userRef.get();

//     if (ipDoc.exists || userDoc.exists) {
//       return res.status(403).json({ message: 'You have already claimed your free number' });
//     }

//     // Step 2: Purchase the free number from 5sim API
//     const url = `https://5sim.net/v1/user/buy/activation/${country}/any/${product}`;
//     const purchaseResponse = await axios.get(url, {
//       headers: {
//         'Authorization': `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
//         'Accept': 'application/json',
//       },
//     });

//     const purchasedNumber = purchaseResponse.data;

//     // Step 3: Save the user data (number) in Firestore
//     if (!userDoc.exists) {
//       await userRef.set({
//         products: [{
//           ...purchasedNumber,
//           free: true,
//           purchaseDate: new Date(),
//           refunded: false,
//         }],
//       });
//     } else {
//       await userRef.update({
//         products: admin.firestore.FieldValue.arrayUnion({
//           ...purchasedNumber,
//           free: true,
//           purchaseDate: new Date(),
//           refunded: false,
//         }),
//       });
//     }

//     // Step 4: **Only after successfully saving the number**, save the IP and UID
//     await ipRef.set({
//       ip: userIp,
//       claimedDate: new Date(),
//     });

//     await db.collection('claimed_users').doc(uid).set({
//       uid: uid,
//       claimedDate: new Date(),
//     });

//     console.log('Free number saved to Firestore:', purchasedNumber);

//     // Step 5: Return the free phone number to the user
//     res.json({ message: 'Free number claimed successfully', number: purchasedNumber });

//   } catch (error) {
//     console.error('Error claiming free number:', error);
//     res.status(500).json({ error: 'Failed to claim free number' });
//   }
// });

app.post("/api/claim-free-number", async (req: Request, res: Response) => {
  const { uid, userIp } = req.body;

  // Log the received values for debugging
  console.log(userIp, "userIp", uid, "uid");

  // Validate that userIp and uid are properly defined
  if (!userIp) {
    return res.status(400).json({ error: "Invalid request: Missing user IP" });
  }

  if (!uid) {
    return res.status(400).json({ error: "Invalid request: Missing user ID" });
  }

  try {
    // Step 1: Check if the user IP or user ID has already claimed a free number
    const ipRef = db.collection("ip_addresses").doc(userIp);
    const ipDoc = await ipRef.get();

    const userRef = db.collection("claimed_users").doc(uid);
    const userDoc = await userRef.get();

    if (ipDoc.exists || userDoc.exists) {
      return res
        .status(403)
        .json({ message: "You have already claimed your free number" });
    }

    // Step 2: Fetch the free number for the country and product from Firestore
    // const freeNumberDoc = await db.collection('free_number').doc('number').get();

    // if (!freeNumberDoc.exists) {
    //   console.log('Free number not available at this moment', freeNumberDoc.data());
    //   return res.status(404).json({ error: 'Free number not available at this moment' });
    // }

    // // Extract country and product from the fetched free_number document
    // const { country, product } = freeNumberDoc.data() as { country: string, product: string };
    const freeNumberCollectionRef = db.collection("free_number");
    const freeNumberQuerySnapshot = await freeNumberCollectionRef
      .limit(1)
      .get();

    if (freeNumberQuerySnapshot.empty) {
      

      // Proceed with your logic here (e.g., 5sim API call, saving data, etc.)
    
      console.log("No documents found in the free_number collection");
      return res
        .status(404)
        .json({ error: "Free number not available at this moment" });
    }
    const freeNumberDoc = freeNumberQuerySnapshot.docs[0]; // Get the first document
      const freeNumberData = freeNumberDoc.data(); // Extract data from the document

      console.log("First document in free_number:", freeNumberData);

      // Extract country and product from the fetched free_number document
      const { country, service } = freeNumberData as { country: string; service: string };
      const lowerCaseCountry = country.toLowerCase();
      const lowerCaseService = service.toLowerCase();


      // Now you can proceed with country and product
      console.log("Country:", country, "Product:", service);

   

    // Step 3: Purchase the free number from 5sim API using the fetched country and product
    // const url = `https://5sim.net/v1/user/buy/activation/${country}/any/${service}`;
    // const purchaseResponse = await axios.get(url, {
    //   headers: {
    //     Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
    //     Accept: "application/json",
    //   },
    // });
    const url = `https://5sim.net/v1/user/buy/activation/${lowerCaseCountry}/any/${lowerCaseService}`;
    const purchaseResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTc0NjU2MzgsImlhdCI6MTcyNTkyOTYzOCwicmF5IjoiNjZjOWYyNGQxY2UxYzI5NGY4Njg4ODA5NGI4NDQ2NzgiLCJzdWIiOjc0NDM2N30.Xzr5Z7UXkcwggML_mLyxEO2vSfVXITMa7PomP1pAAvw6ldzTwx4dbPhE3mJs5_Dwpumj2MJYppyCQiTvB5nF72mQE0Vp_lIIiAG0NIHrwK3inAIUtbRVo2V56J-aSh4lpzmz9g_ADXGe3nQwiqIHUrs8F4Ql9NsRIpCrUxWNeJJWu0jNVk0n3K6bQt3G5c8ZCDr_MFa10fitUfdLVnD8y603PPxcOhYae87mJz28kNEBf3m9ZX4tOWWcYVLdrBXijwFM18yoI96mlbYaSD0YFRl_TeyPh8PtR9ljPk1R9AydEwf0a-e8rYFcKyKzSBs5rUuoaCwCsIJ68sKRciTd5Q`,
        Accept: "application/json",
      },
    });

    const purchasedNumber = purchaseResponse.data;

    const userRefProduct = db.collection("users").doc(uid);
    const userDocuserRefProduct = await userRefProduct.get();
    await userRefProduct
      .collection("products")
      .doc(purchasedNumber.id.toString())
      .set({
        ...purchasedNumber,
        purchaseDate: new Date(),
        refunded: false,
        free: true,
      });
    // Step 4: Save the purchased number to the user's Firestore document (with `free: true`)
    // if (!userDocuserRefProduct.exists) {
    //   await userRefProduct.set({
    //     products: [
    //       {
    //         ...purchasedNumber,
    //         free: true,
    //         purchaseDate: new Date(),
    //         refunded: false,
    //       },
    //     ],
    //   });
    // } else {
    //   await userRefProduct.update({
    //     products: admin.firestore.FieldValue.arrayUnion({
    //       ...purchasedNumber,
    //       free: true,
    //       purchaseDate: new Date(),
    //       refunded: false,
    //     }),
    //   });
    // }

    // Step 5: **Only after successfully saving the number**, save the IP and UID to mark as claimed
    await ipRef.set({
      ip: userIp,
      claimedDate: new Date(),
    });

    await db.collection("claimed_users").doc(uid).set({
      uid: uid,
      claimedDate: new Date(),
    });

    console.log("Free number saved to Firestore:", purchasedNumber);

    // Step 6: Return the free phone number to the user
    res.json({
      message: "Free number claimed successfully",
      number: purchasedNumber,
    });
  } catch (error) {
    console.error("Error claiming free number:", error);
    res.status(500).json({ error: "Failed to claim free number" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
