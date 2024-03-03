import * as crypto from "crypto";
import { buildResponse } from "../helper/httpResponse.js";
import * as dotenv from "dotenv";
import { generateCODCreateSchema, generatePaymentCreateSchema } from "../schema/paymentScehma.js";
import {
  createDynamoRecord,
  updateDynamo,
} from "../middlewares/db.middlewares.js";
import Razorpay from "razorpay";
import { currentDate } from "../helper/utility.js";
dotenv.config();

const razorpay_secret = process.env.RAZORPAY_APT_SECRET || "";
const domain = process.env.REDIRECT_PAYMENT_DOMAIN || "";

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "",
  key_secret: razorpay_secret,
});

export async function checkout(body) {
  try {
    // const parseBody = JSON.parse(body)

    if (body.payment_mode === "razorpay") {
      const options = {
        amount: Number(body.amount * 100),
        currency: "INR",
      };
      const order = await instance.orders.create(options);

      console.log("🚀 ~ checkout ~ order:", order);

      const data = {
        razorpay_order_id: order.id,
        order_id: body.order_id,
        payment_mode: body.payment_mode,
      };

      const paySchema = generatePaymentCreateSchema(data);

      const createPayment = await createDynamoRecord({
        dbName: "payment_record",
        item: paySchema,
        messages: {
          200: `payment created successfully`,
        },
      });

      console.log("🚀 ~ checkout ~ createPayment:", createPayment);

      return buildResponse({
        code: 200,
        body: {
          success: true,
          order,
        },
      });
    }else{
      const data = {
        order_id: body.order_id,
        payment_mode:body.payment_mode
      };
      const paySchema = generateCODCreateSchema(data);

      const createPayment = await createDynamoRecord({
        dbName: "payment_record",
        item: paySchema,
        messages: {
          200: `payment created successfully`,
        },
      });

      console.log("🚀 ~ checkout ~ createPayment:", createPayment)
      return buildResponse({
        code: 200,
        body: {
          success: true,
          order:'COD created successfully',
        },
      })
    }
  } catch (error) {
    console.log("🚀 ~ checkout ~ error:", error);
    return buildResponse({
      code: 400,
      body: { success: false, message: "error in creating checkout" },
    });
  }
}

export async function paymentVerification(body) {
  // const data = JSON.parse(body)
  const params = new URLSearchParams(body);
  const razorpay_payment_id = params.get("razorpay_payment_id");
  const razorpay_order_id = params.get("razorpay_order_id");
  const razorpay_signature = params.get("razorpay_signature");

  const razorBody = razorpay_order_id + "|" + razorpay_payment_id;
  console.log("🚀 ~ paymentVerification ~ razorBody:", razorBody);

  const expectedSignature = crypto
    .createHmac("sha256", razorpay_secret)
    .update(razorBody.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here
    const updatePaymentRecord = await updateDynamo({
      params: {
        TableName: "payment_record",
        Key: {
          razorpay_order_id: razorpay_order_id,
        },
        UpdateExpression:
          "SET razorpay_payment_id = :val1, razorpay_signature = :val2 , pay_status= :val3, updated_at= :val4", // Define the attributes you want to update
        ExpressionAttributeValues: {
          ":val1": razorpay_payment_id,
          ":val2": razorpay_signature,
          ":val3": "paid",
          ":val4": currentDate()
        },
        ReturnValues: "ALL_NEW",
      },
    });
    console.log(
      "🚀 ~ paymentVerification ~ updatePaymentRecord:",
      updatePaymentRecord
    );

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
}
