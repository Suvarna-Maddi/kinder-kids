export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (
  amount: number,
  userDetails: { id?: string; name?: string; email?: string; contact?: string },
  onSuccess: (data: any) => void,
  onError: (error: any) => void,
) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    onError(new Error("Razorpay SDK failed to load. Are you online?"));
    return;
  }

  try {
    // 1. Create order on backend
    const orderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to create order");
    }

    const orderData = await orderResponse.json();

    // 2. Open Razorpay modal
    const options = {
      key: orderData.key_id, // Frontend only receives the public Key ID
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Kinder Kids",
      description: "Premium Upgrade",
      order_id: orderData.order_id,
      handler: async function (response: any) {
        try {
          // 3. Verify payment on backend
          const verifyResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userDetails.id, // Pass userId for DB association
              amount: amount,
              currency: "INR",
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            onSuccess(verifyData);
          } else {
            onError(new Error("Payment verification failed"));
          }
        } catch (error) {
          onError(error);
        }
      },
      prefill: {
        name: userDetails.name || "Kinder Kids User",
        email: userDetails.email || "hello@kinderkidsspace.in",
        contact: userDetails.contact || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      onError(response.error);
    });
    paymentObject.open();
  } catch (error) {
    onError(error);
  }
};
