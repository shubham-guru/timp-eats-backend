import * as crypto from "crypto";
import { buildResponse } from "../helper/httpResponse.js";
import * as dotenv from 'dotenv'
import { generatePaymentSchema } from "../schema/paymentScehma.js";
import { createDynamoRecord } from "../middlewares/db.middlewares.js";
import Razorpay from "razorpay"
dotenv.config()



const razorpay_secret = process.env.RAZORPAY_APT_SECRET || ""
const domain = process.env.REDIRECT_PAYMENT_DOMAIN || ""

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "",
  key_secret: razorpay_secret,
});


export async function checkout(body){
  try {
    const parseBody = JSON.parse(body)
    
    const options = {
      amount: Number(parseBody.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    console.log("🚀 ~ checkout ~ order:", order)
    
    return buildResponse({code:200,body:{
      success: true,
      order,
    }})
  } catch (error) {
    console.log("🚀 ~ checkout ~ error:", error)
    return buildResponse({code:400,body:{success:false,message:'error in creating checkout'}})
  }
};



export async function paymentVerification(body){
  const data = JSON.parse(body)
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data


  const razorBody = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", razorpay_secret)
    .update(razorBody.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    const paySchema = generatePaymentSchema(data)

   const createPayment =  await createDynamoRecord({
      dbName:"payment_record",
      item: paySchema,
      messages: {
        200: `payment created successfully`,
      },
    });

    return buildResponse({
      code: 303,
      body: `${domain}/payment-status?reference=${razorpay_payment_id}`,
    });
  } else {
    return buildResponse({
      code: 400,
      body: {
        success: false,
      },
    });
  }
};
