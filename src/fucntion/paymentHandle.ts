import crypto from "crypto";
import { buildResponse } from "../helper/httpResponse.js";

export const checkout = async (params:any) => {
  const options = {
    amount: Number(params.amount * 100),
    currency: "INR",
  };
  const order = await orders.create(options);

  return buildResponse({code:200,body:{ success: true,
    order}})
};

export const paymentVerification = async () => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://localhost:5173/payment-status?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};