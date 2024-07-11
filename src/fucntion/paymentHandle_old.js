import * as crypto from "crypto";
import { builRedirectResponse, buildResponse } from "../helper/httpResponse.js";
import * as dotenv from "dotenv";
import { generateCODCreateSchema, generatePaymentCreateSchema } from "../schema/paymentScehma.js";
import {
  createDynamoRecord,
  updateDynamo,
} from "../middlewares/db.middlewares.js";
import { currentDate } from "../helper/utility.js";
import paypal from '@paypal/checkout-server-sdk';
dotenv.config();

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_SECRET_KEY;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function checkout(body) {
  try {
    // const parseBody = JSON.parse(body)

    if (body.payment_mode === "paypal") {

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: body.currency,
            value: body.amount // Enter your order total here
          }
        }]
      });
      const response = await client.execute(request);
      console.log("🚀 ~ checkout ~ response:", response)
      const data = {
        paypal_order_id: response.result.id,
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

      console.log("🚀 ~ checkout ~ createPayment:",createPayment );

      return buildResponse({
        code: 200,
        body: {
          success: true,
          order:data.paypal_order_id,
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

    return builRedirectResponse({
      code: 302,
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