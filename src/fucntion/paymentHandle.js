import * as crypto from "crypto";
import { buildResponse } from "../helper/httpResponse.js";
import * as dotenv from "dotenv";
import {
  generateCODCreateSchema,
  generatePaymentCreateSchema,
} from "../schema/paymentScehma.js";
import {
  createDynamoRecord,
  updateDynamo,
} from "../middlewares/db.middlewares.js";
import Razorpay from "razorpay";
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
    const options = {
      amount: Number(body.amount * 100),
      currency: body.currency,
      receipt: body.order_id,
    };

    const order = await instance.orders.create(options);
    console.log("🚀 ~ checkout ~ order:", order);

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

    console.log("🚀 ~ checkout ~ updatePaymentRecord:", updatePaymentRecord);

    return buildResponse({
      code: 200,
      body: {
        success: true,
        order,
      },
    });
  } catch (error) {
    console.log("🚀 ~ checkout ~ error:", error);
    return buildResponse({
      code: 400,
      body: { success: false, message: "error in creating checkout" },
    });
  }
}

export async function paymentVerification(body) {
  try {
    const data = JSON.parse(body);
    console.log("🚀 ~ paymentVerification ~ data:", data);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const razorBody = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", razorpay_secret)
      .update(razorBody.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    // const isAuthentic = true
    console.log("🚀 ~ paymentVerification ~ isAuthentic:", isAuthentic);

    const [paymentStatus, orderStatus] = await Promise.all([
      await instance.payments.fetch(razorpay_payment_id),
      await instance.orders.fetch(razorpay_order_id),
    ]);
    console.log("🚀 ~ paymentVerification ~ orderStatus:", orderStatus);
    console.log("🚀 ~ paymentVerification ~ paymentStatus:", paymentStatus);
    const { id, status: payment_status, fee, tax, acquirer_data } = paymentStatus;
    const { status: order_status, receipt } = orderStatus;

    // Database comes here
    if (isAuthentic) {
      if (
        paymentStatus.status === "captured" &&
        orderStatus.status === "paid"
      ) {
        const updatePaymentRecord = await updateDynamo({
          params: {
            TableName: "order_data",
            Key: {
              order_id: receipt,
            },
            UpdateExpression:
              "SET razorpay_payment_id = :val1, razorpay_order_status = :val2, razorpay_payment_status = :val3, transaction_details = :val4, order_status = :val5", // Define the attributes you want to update
            ExpressionAttributeValues: {
              ":val1": id,
              ":val2": order_status,
              ":val3": payment_status,
              ":val4": { trx_fee: fee, trx_tax: tax, trx_id: acquirer_data },
              ":val5": "payment_successful",
            },
            ReturnValues: "ALL_NEW",
          },
        });
        console.log(
          "🚀 ~ paymentVerification ~ updatePaymentRecord:",
          updatePaymentRecord
        );
        return buildResponse({
          code: 200,
          body: {
            message:
              "Payment successful, you will be receive mail for order information.",
            order_id: receipt,
            payment_id: id,
            payment_status: payment_status,
            order_status: order_status,
            transaction_details: acquirer_data,
          },
        });
      } else if (paymentStatus.status === "failed") {
        const updatePaymentRecord = await updateDynamo({
          params: {
            TableName: "order_data",
            Key: {
              order_id: receipt,
            },
            UpdateExpression:
              "SET razorpay_payment_id = :val1, razorpay_order_status = :val2, razorpay_payment_status = :val3, order_status = :val4", // Define the attributes you want to update
            ExpressionAttributeValues: {
              ":val1": id,
              ":val2": order_status,
              ":val3": payment_status,
              ":val4": "failed",
            },
            ReturnValues: "ALL_NEW",
          },
        });
        console.log(
          "🚀 ~ paymentVerification ~ updatePaymentRecord:",
          updatePaymentRecord
        );
        return buildResponse({
          code: 400,
          body: {
            message: "Payment failed, kindly go to cart and order again.",
            error_description: paymentStatus.error_description,
            order_id: receipt,
            payment_id: id,
            payment_status: payment_status,
            order_status: order_status,
          },
        });
      }
    } else {
      const updatePaymentRecord = await updateDynamo({
        params: {
          TableName: "order_data",
          Key: {
            order_id: receipt,
          },
          UpdateExpression:
            "SET razorpay_payment_id = :val1, razorpay_order_status = :val2, razorpay_payment_status = :val3, order_status = :val4", // Define the attributes you want to update
          ExpressionAttributeValues: {
            ":val1": id,
            ":val2": order_status,
            ":val3": payment_status,
            ":val4": "failed",
          },
          ReturnValues: "ALL_NEW",
        },
      });
      console.log(
        "🚀 ~ paymentVerification ~ updatePaymentRecord:",
        updatePaymentRecord
      );
      return buildResponse({
        code: 400,
        body: {
          message: "Payment failed, kindly go to cart and order again.",
          error_description: paymentStatus.error_description,
          order_id: receipt,
            payment_id: id,
            payment_status: payment_status,
            order_status: order_status,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ paymentVerification ~ error:", error);
    return buildResponse({
      code: 500,
      body: error.message,
    });
  }
}
