"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const firebase_1 = require("./firebase");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const stripe = new stripe_1.default('sk_test_51Ps4ASHiyrduhHMT81gXgjh1HglUaf4PSdxjP9ZWkZFGJBhz5ehjpk4bNxM2YZTT5zHiI42EQ8OROgCKn7CXGLNK007cMxAofs', {
    apiVersion: '2020-08-27',
});
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Create a Checkout Session
app.post('/api/create-checkout-session', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { uid, amount, email } = req.body;
    try {
        // Fetch customer from Firestore
        const userRef = firebase_1.db.collection('users').doc(uid);
        const userDoc = yield userRef.get();
        let customerId;
        if (userDoc.exists && ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.stripeCustomerId)) {
            customerId = (_b = userDoc.data()) === null || _b === void 0 ? void 0 : _b.stripeCustomerId;
        }
        else {
            // Create new Stripe customer if one doesn't exist
            const customer = yield stripe.customers.create({
                email,
                description: `Customer for user ${uid}`,
            });
            // Save customer ID to Firestore
            yield userRef.set({ stripeCustomerId: customer.id }, { merge: true });
            customerId = customer.id;
        }
        // Create Checkout Session
        const session = yield stripe.checkout.sessions.create({
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
            success_url: 'http://localhost:5173/', // Redirect after success
            cancel_url: 'http://localhost:3000/cancel', // Redirect after cancel
        });
        res.json({ url: session.url });
    }
    catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: error });
    }
}));
//webhook for success
// Get Customer Balance
app.get('/api/check-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.query; // Get Stripe customer ID from query parameters
    if (!customerId || typeof customerId !== 'string') {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }
    try {
        // Fetch user from Firestore
        const userRef = firebase_1.db.collection('users').where('stripeCustomerId', '==', customerId);
        const snapshot = yield userRef.get();
        if (snapshot.empty) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        // Assuming there's only one matching document
        const userDoc = snapshot.docs[0].data();
        const balance = userDoc.balance || 0;
        res.json({ balance });
    }
    catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Failed to retrieve balance' });
    }
}));
// Update customer balance in Firestore after payment confirmation
app.post('/api/update-balance', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { uid, amount } = req.body;
    try {
        const userRef = firebase_1.db.collection('users').doc(uid);
        const userDoc = yield userRef.get();
        if (!userDoc.exists) {
            return res.status(404).send("User not found");
        }
        const currentBalance = ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.balance) || 0;
        const newBalance = currentBalance + amount;
        yield userRef.update({ balance: newBalance });
        res.json({ balance: newBalance });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
app.listen(3000, () => console.log('Server running on port 3000'));
