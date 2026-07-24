import crypto from "crypto";
import admin from "firebase-admin";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in Vercel environment variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error.stack);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      amount,
      currency = "INR",
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return res.status(400).json({ message: "Missing payment verification details or user ID" });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Razorpay secret is missing in environment variables");
      return res.status(500).json({ message: "Internal server configuration error" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successfully verified.
      // Save to Firestore using a transaction to prevent duplicates
      const db = admin.firestore();

      // Use razorpay_order_id as the document ID for idempotency (prevent duplicates)
      const paymentRef = db.collection("payments").doc(razorpay_order_id);

      await db.runTransaction(async (transaction) => {
        const paymentDoc = await transaction.get(paymentRef);
        if (paymentDoc.exists) {
          throw new Error("Duplicate payment record");
        }

        const userRef = db.collection("users").doc(userId);
        const userDoc = await transaction.get(userRef);

        if (userDoc.exists) {
          const userData = userDoc.data();
          const now = admin.firestore.Timestamp.now();
          if (
            userData.isPremium &&
            userData.subscriptionExpiryDate &&
            userData.subscriptionExpiryDate.toMillis() > now.toMillis()
          ) {
            throw new Error("User already has an active subscription");
          }
        }

        // Set payment record
        transaction.set(paymentRef, {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: amount || 0,
          currency: currency,
          status: "success",
          userId: userId,
          purchaseTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Set subscription details on user document
        const durationDays = req.body.durationDays || 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + durationDays);

        transaction.set(
          userRef,
          {
            isPremium: true,
            premiumUnlocked: true,
            subscriptionStartDate: admin.firestore.FieldValue.serverTimestamp(),
            subscriptionExpiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
          },
          { merge: true },
        );
      });

      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully and saved" });
    } else {
      console.error("Payment signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    if (error.message === "Duplicate payment record") {
      console.warn("Attempted to save duplicate payment record");
      return res.status(200).json({ success: true, message: "Payment already processed" });
    }
    if (error.message === "User already has an active subscription") {
      console.warn("User already has an active subscription");
      return res
        .status(400)
        .json({ success: false, message: "User already has an active subscription" });
    }
    console.error("Error verifying or saving payment:", error);
    return res.status(500).json({ message: "Internal server error during verification" });
  }
}
