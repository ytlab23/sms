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
const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2020-08-27",
});

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
      success_url: "https://smsapp.io/paymentsuccess",
      cancel_url: "https://smsapp.io/paymentfailure",
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
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(
        "Webhook signature verification failed:",
        (err as Error).message
      );
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const { customer, amount_received } = paymentIntent;

        try {
          const userSnapshot = await db
            .collection("users")
            .where("stripeCustomerId", "==", customer)
            .get();

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            const userRef = db.collection("users").doc(userDoc.id);
            const currentBalance = userDoc.data().balance || 0;

            await userRef.update({
              balance: currentBalance + amount_received / 100,
            });
          } else {
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
    }

    res.json({ received: true });
  }
);

app.get("/api/balance", async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

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
  try {
    const apiKey = process.env.SIM_API_KEY;

    if (!apiKey) {
      console.error("API key is not set.");
      return res.status(500).json({ error: "API key is missing" });
    }

    const response = await axios.get(
      `https://5sim.net/v1/guest/products/${country}/any`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIM_API_KEY}`,
        },
      }
    );

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
        Authorization: `Bearer ${process.env.SIM_API_KEY}`,
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

  try {
    const response = await axios.get(
      `https://5sim.net/v1/guest/prices?country=${country}&product=${service}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIM_API_KEY}`,
        },
      }
    );

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
    const error = new Error("Insufficient balance");
    error.name = "InsufficientBalanceError";
    throw error;
  }

  const currentBalance = userDoc.data()?.balance || 0;
  if (currentBalance < cost) {
    const error = new Error("Insufficient balance");
    error.name = "InsufficientBalanceError";
    throw error;
  }

  return { userRef, currentBalance };
};

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
      if (data?.price !== undefined) {
        return data.price;
      }
    }

    // Step 2: Fetch default product price if country-specific price is not found
    const defaultServiceDocRef = db.collection("services").doc(product);
    const defaultDocSnap = await defaultServiceDocRef.get();

    if (defaultDocSnap.exists) {
      const defaultData = defaultDocSnap.data();
      if (defaultData?.price !== undefined) {
        return defaultData.price;
      }
    }

    // Step 3: If price not found, log an error and throw an exception
    throw new Error(`Price for ${product} not found`);
  } catch (error) {
    console.error("Error fetching product price:", error);
    throw new Error("Unable to fetch product price");
  }
};

// Get user's purchased products
app.post("/api/buy-product", async (req: Request, res: Response) => {
  const { uid, country, product } = req.body; // Removed operator field

  try {
    // Step 1: Fetch the price of the product from Firestore
    const productCost = await getProductPrice(country, product);

    // Step 2: Check if the user has enough balance
    const { userRef, currentBalance } = await checkBalance(
      String(uid),
      productCost
    );

    // Step 3: Purchase a number from 5sim API (without operator field)
    const url = `https://5sim.net/v1/user/buy/activation/${country}/any/${product}`;
    const purchaseResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.SIM_API_KEY}`,
        Accept: "application/json",
      },
    });

    const purchasedNumber = purchaseResponse.data;

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

    ("Product information saved to Firestore");

    // Step 5: Deduct cost from the user's balance
    const newBalance = currentBalance - productCost;
    await userRef.update({ balance: newBalance });

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
    res.status(500).json({
      error: (error as Error).message || "Failed to purchase product",
    });
  }
});

app.get("/api/get-user-products", async (req: Request, res: Response) => {
  const { uid } = req.query;

  try {
    const userRef = db.collection("users").doc(String(uid));
    const productsSnapshot = await userRef.collection("products").get();

    if (productsSnapshot.empty) {
      return res.status(404).json({ message: "No products found for user" });
    }

    const products = productsSnapshot.docs.map((doc) => doc.data());

    res.json(products);
  } catch (error) {
    console.error("Error fetching user products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/get-sms", async (req: Request, res: Response) => {
  const { uid, numberId } = req.query;

  if (!uid || !numberId) {
    return res.status(400).json({ error: "Missing uid or numberId" });
  }

  try {
    // Fetch SMS from 5sim API
    const response = await axios.get(
      `https://5sim.net/v1/user/check/${numberId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SIM_API_KEY}`,
        },
      }
    );

    // Query Firestore for the 'refunded' field
    const userDoc = await db
      .collection("users")
      .doc(uid as string)
      .collection("products")
      .doc(numberId as string)
      .get();

    let refunded = false;
    if (userDoc.exists) {
      refunded = userDoc.data()?.refunded || false;
    }

    // Add 'refunded' field to the response data
    const responseData = {
      ...response.data,
      refunded,
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error fetching SMS:", error);
    res.status(500).json({ error: "Failed to fetch SMS" });
  }
});
app.post("/api/cancel", async (req: Request, res: Response) => {
  const { uid, numberId } = req.body;

  const trimmedUid = uid?.trim();
  const trimmedNumberId = String(numberId)?.trim();

  if (!trimmedUid || !trimmedNumberId || trimmedNumberId === "") {
    ("Invalid uid or numberId provided");
    return res
      .status(400)
      .json({ error: "Missing or invalid uid or numberId" });
  }

  try {
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
      return res
        .status(400)
        .json({ error: "Product not eligible for cancellation" });
    }

    // Call 5sim API to cancel the number
    const cancelResponse = await axios.get(
      `https://5sim.net/v1/user/cancel/${trimmedNumberId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SIM_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (cancelResponse.status === 200) {
      // Refund the balance to the user
      const productCost = productData.updatedPrice;
      const userDoc = await userRef.get();
      const userBalance = userDoc.data()?.balance || 0;
      const newBalance = userBalance + productCost;

      // Update user's balance in Firestore
      await userRef.update({ balance: newBalance });

      // Mark the product as refunded
      await userRef
        .collection("products")
        .doc(trimmedNumberId)
        .update({ refunded: true });

      ("Service canceled and balance refunded");
      res.json({
        message: "Service canceled and balance refunded",
        newBalance,
      });
    } else {
      throw new Error("Failed to cancel the number via 5sim");
    }
  } catch (error) {
    console.error("Error canceling product:", error);
    res.status(500).json({ error: "Failed to cancel product" });
  }
});

app.post("/api/refund", async (req: Request, res: Response) => {
  const { uid, numberId } = req.body;

  const trimmedUid = uid?.trim();
  const trimmedNumberId = String(numberId)?.trim();

  if (!trimmedUid || !trimmedNumberId || trimmedNumberId === "") {
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
    const countryServiceKey = `${country}_${service}`;

    const statisticsRef = db.collection("statistics").doc(countryServiceKey);

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
      await statisticsRef.set(
        {
          unsuccessfulRefunds: FieldValue.increment(1),
          successfulRefunds: statisticsSnapshot.data()?.successfulRefunds || 0,
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

    await statisticsRef.set(
      {
        successfulRefunds: FieldValue.increment(1),
        unsuccessfulRefunds:
          statisticsSnapshot.data()?.unsuccessfulRefunds || 0,
      },
      { merge: true }
    );

    ("Balance refunded");
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
          successfulRefunds: statisticsSnapshot.data()?.successfulRefunds || 0,
        },
        { merge: true }
      );
    }

    res.status(500).json({ error: "Failed to refund product" });
  }
});

app.get("/api/check-free-number", async (req: Request, res: Response) => {
  const userIp = req.query.ip?.toString() || req.ip;
  const uid = req.query.uid?.toString() || "";

  try {
    // Check if the IP has already claimed a free number
    const ipRef = db.collection("ip_addresses").doc(userIp || "");
    const ipDoc = await ipRef.get();

    // Check if the user ID has already claimed a free number
    const userRef = db.collection("claimed_users").doc(uid as string);
    const userDoc = await userRef.get();

    if (ipDoc.exists || userDoc.exists) {
      return res.status(403).json({
        eligible: false,
        message: "You have already claimed your free number",
      });
    }

    res.json({ eligible: true, message: "You are eligible for a free number" });
  } catch (error) {
    console.error("Error checking free number eligibility:", error);
    res.status(500).json({ error: "Failed to check free number eligibility" });
  }
});

app.post("/api/claim-free-number", async (req: Request, res: Response) => {
  const { uid, userIp } = req.body;

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

    const freeNumberCollectionRef = db.collection("free_number");
    const freeNumberQuerySnapshot = await freeNumberCollectionRef
      .limit(1)
      .get();

    if (freeNumberQuerySnapshot.empty) {
      ("No documents found in the free_number collection");
      return res
        .status(404)
        .json({ error: "Free number not available at this moment" });
    }
    const freeNumberDoc = freeNumberQuerySnapshot.docs[0];
    const freeNumberData = freeNumberDoc.data();

    const { country, service } = freeNumberData as {
      country: string;
      service: string;
    };
    const lowerCaseCountry = country.toLowerCase();
    const lowerCaseService = service.toLowerCase();

    const url = `https://5sim.net/v1/user/buy/activation/${lowerCaseCountry}/any/${lowerCaseService}`;
    const purchaseResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.SIM_API_KEY}`,
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

    await ipRef.set({
      ip: userIp,
      claimedDate: new Date(),
    });

    await db.collection("claimed_users").doc(uid).set({
      uid: uid,
      claimedDate: new Date(),
    });

    res.json({
      message: "Free number claimed successfully",
      number: purchasedNumber,
    });
  } catch (error) {
    console.error("Error claiming free number:", error);
    res.status(500).json({ error: "Failed to claim free number" });
  }
});

app.listen(3000, () => "Server running on port 3000");
