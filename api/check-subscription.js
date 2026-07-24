import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newlines in Vercel environment variables
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error.stack);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // allow userId to be passed via query string or body
    const userId = req.query.userId || req.body?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'Missing user ID' });
    }

    const db = admin.firestore();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Check subscription status
    if (userData.isPremium && userData.subscriptionExpiryDate) {
      const now = admin.firestore.Timestamp.now();
      
      if (userData.subscriptionExpiryDate.toMillis() < now.toMillis()) {
        // Subscription has expired
        await userRef.update({
          isPremium: false,
          premiumUnlocked: false
        });
        
        return res.status(200).json({ 
          isActive: false, 
          message: 'Subscription expired',
          expiryDate: userData.subscriptionExpiryDate.toDate()
        });
      } else {
        // Subscription is active
        return res.status(200).json({ 
          isActive: true, 
          message: 'Subscription is active',
          expiryDate: userData.subscriptionExpiryDate.toDate()
        });
      }
    }

    // User is not premium
    return res.status(200).json({ 
      isActive: false, 
      message: 'User does not have an active subscription' 
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return res.status(500).json({ message: 'Internal server error checking subscription' });
  }
}
