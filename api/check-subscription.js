import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error.stack);
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const userId = req.query.userId || req.body?.userId;

    if (!userId) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const db = getFirestore();
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    if (userData.isPremium && userData.subscriptionExpiryDate) {
      const now = Timestamp.now();

      if (userData.subscriptionExpiryDate.toMillis() < now.toMillis()) {
        // Subscription expired — revoke
        await userRef.update({
          isPremium: false,
          premiumUnlocked: false,
        });

        return res.status(200).json({
          isActive: false,
          message: "Subscription expired",
          expiryDate: userData.subscriptionExpiryDate.toDate(),
        });
      } else {
        return res.status(200).json({
          isActive: true,
          message: "Subscription is active",
          expiryDate: userData.subscriptionExpiryDate.toDate(),
          subscriptionStartDate: userData.subscriptionStartDate?.toDate?.() || null,
          paymentId: userData.paymentId || null,
        });
      }
    }

    return res.status(200).json({
      isActive: false,
      message: "User does not have an active subscription",
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return res.status(500).json({ message: "Internal server error checking subscription" });
  }
}
