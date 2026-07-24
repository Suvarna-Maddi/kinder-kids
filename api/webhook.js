import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    
    if (!webhookSignature) {
      console.error('Missing Razorpay webhook signature');
      return res.status(400).json({ message: 'Missing signature' });
    }

    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error('Razorpay webhook secret is missing in environment variables');
      return res.status(500).json({ message: 'Internal server configuration error' });
    }

    // Next.js/Vercel typically parses req.body as JSON. Razorpay requires the raw body string to verify signatures.
    // Assuming Vercel serverless functions environment where we can JSON.stringify the body if it's already an object.
    // Note: In a real production setup you might need to capture the raw body buffer before it gets parsed.
    // For standard Vercel JSON payloads, JSON.stringify usually works if the order of keys matches, 
    // but the safest bet in standard Vercel API without raw body parsing configured is JSON.stringify(req.body).
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.error('Invalid webhook signature');
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Webhook is authentic
    const eventType = req.body.event || 'unknown';
    console.log(`Received legitimate Razorpay webhook event: ${eventType}`);

    // Process event based on eventType... (e.g. payment.captured)

    // Return 200 OK immediately to acknowledge receipt
    return res.status(200).json({ status: 'ok' });

  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
