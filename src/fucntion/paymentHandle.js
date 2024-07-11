import * as crypto from "crypto";
import { buildResponse } from "../helper/httpResponse.js";
import * as dotenv from 'dotenv'
import { generateCODCreateSchema, generatePaymentCreateSchema } from "../schema/paymentScehma.js";
import {createDynamoRecord,updateDynamo } from "../middlewares/db.middlewares.js";
import Razorpay from "razorpay"
dotenv.config()



const razorpay_secret = process.env.RAZORPAY_APT_SECRET || ""
const domain = process.env.REDIRECT_PAYMENT_DOMAIN || ""

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "",
  key_secret: razorpay_secret,
});

//! order response from razorpay
 // {
    //     "id": "order_DaZlswtdcn9UNV",
    //     "entity": "order",
    //     "amount": 50000,
    //     "amount_paid": 0,
    //     "amount_due": 50000,
    //     "currency": "INR",
    //     "receipt": "Receipt #20",
    //     "status": "created",
    //     "attempts": 0,
    //     "notes": {
    //       "key1": "value1",
    //       "key2": "value2"
    //     },
    //     "created_at": 1572502745
    //   }

export async function checkout(body){
  try {
    // const parseBody = JSON.parse(body)
    const options = {
      amount: Number(body.amount * 100),
      currency: body.currency,
      receipt: body.order_id
    };

    const order = await instance.orders.create(options);
    console.log("🚀 ~ checkout ~ order:", order)

    const updatePaymentRecord = await updateDynamo({
        params: {
          TableName: "order_data",
          Key: {
            order_id: body.order_id,
          },
          UpdateExpression:
            "SET razorpay_order_id = :val1, razorpay_order_status = :val2", // Define the attributes you want to update
          ExpressionAttributeValues: {
            ":val1": order.id,
            ":val2": order.status,
          },
          ReturnValues: "ALL_NEW",
        },
      });

      console.log("🚀 ~ checkout ~ updatePaymentRecord:", updatePaymentRecord)

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

    const paySchema = generatePaymentCreateSchema(data)

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