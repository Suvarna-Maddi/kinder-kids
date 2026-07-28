import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

let initError = null;

function ensureFirebaseInitialized() {
  console.log({
    hasProjectId: typeof process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: typeof process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: typeof process.env.FIREBASE_PRIVATE_KEY,
    projectIdValue: process.env.FIREBASE_PROJECT_ID
  });

  if (!getApps().length) {
    try {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
      console.log("Firebase initialized successfully. App count:", getApps().length);
      initError = null;
    } catch (error) {
      console.error("Firebase admin initialization error:", error.stack);
      initError = error;
      throw error;
    }
  }
}

export default async function handler(req, res) {
  try {
    ensureFirebaseInitialized();
  } catch (error) {
    return res.status(500).json({
      message: "Firebase Admin initialization failed",
      error: error.message,
      details: "Check that FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are correct."
    });
  }

  if (getApps().length === 0) {
    return res.status(500).json({
      message: "Firebase Admin is not initialized (app count is 0)"
    });
  }
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
