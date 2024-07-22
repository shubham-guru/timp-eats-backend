import { buildResponse } from "../helper/httpResponse.js";
import { createDynamoRecord, getDynamoRecord } from "../middlewares/db.middlewares.js";
import { sendMailToClient } from "../middlewares/mailler/mailing.js";
import generateOrderSchema from "../schema/orderSchema.js";
import { generateUSerSchema } from "../schema/userSchema.js";
import { checkout } from "./paymentHandle.js";

export async function createOrderWithUser(details) {
  try {
    const { user, order, amount, currency } = JSON.parse(details);
    const UserSchema = generateUSerSchema(user);
    const orderSchema = generateOrderSchema(order, amount, currency, UserSchema.user_id);

    const [createUser, createOrder] = (await Promise.allSettled([
      await createDynamoRecord({
        dbName: "users",
        item: UserSchema,
        messages: {
          200: `user created successfully`,
        },
      }),
      await createDynamoRecord({
        dbName: "order_data",
        item: orderSchema,
        messages: {
          200: `order created successfully`,
        },
      })
    ])).map(({ status, value }) => value)
    console.log("🚀 ~ createOrderWithUser ~ createUser:", createUser)
    console.log("🚀 ~ createOrderWithUser ~ createOrder:", createOrder)

    if (createUser.code !== 200 || createOrder.code !== 200)
      return buildResponse({
        code: 400,
        body: { sucess: false, message: "Error in order creation" },
      });


    if (orderSchema.payment_mode === "razorpay") {
      const checkoutOrder = await checkout({
        currency,
        amount,
        order_id: orderSchema.order_id,
        payment_mode: orderSchema.payment_mode,
      })

      if (checkoutOrder.statusCode !== 200)
        return buildResponse({
          code: 400,
          body: { sucess: false, message: "Error in creating payment" },
        });
      // const sendMail = await sendMailToClient({ toAddress: UserSchema.email, subject: 'order success', message: { user: UserSchema.full_name, body: "order success" } })
      // console.log("🚀 ~ createOrderWithUser ~ sendMail:", sendMail)
      const finalRes = buildResponse({
        code: 200,
        body: {
          message: "user and order created successfully, payment required.",
          sucess: true,
          order: JSON.parse(checkoutOrder.body).order,
        },
      });
      console.log(finalRes, "final response")
      return finalRes
    }

          
    const sendCustomerMailPromise = sendMailToClient({ toAddress: UserSchema.email, subject: 'Order placed', message: { user:{full_name:UserSchema.full_name,complete_address:UserSchema.complete_address[0],phone_number:UserSchema.phone_number},order:orderSchema.order_detail,payment_method:orderSchema.payment_mode,sub_total:orderSchema.amounts,order_id:orderSchema.order_id,delievery_charge: orderSchema?.delievery_charge !== 0 ? orderSchema.delievery_charge : null, body: "order successfull" } })
    const sendSellerMailPromise = sendMailToClient({ toAddress: 'timpeats0@gmail.com', subject: 'Order received', message: { user:{full_name:UserSchema.full_name,complete_address:UserSchema.complete_address[0],phone_number:UserSchema.phone_number},order:orderSchema.order_detail,payment_method:orderSchema.payment_mode,sub_total:orderSchema.amounts,order_id:orderSchema.order_id,delievery_charge: orderSchema?.delievery_charge !== 0 ? orderSchema.delievery_charge : null, body: "order Received" } })
    const [sendCustomerMail,sendSellerMail] = await Promise.all([sendCustomerMailPromise,sendSellerMailPromise])
    console.log("🚀 ~ createOrderWithUser ~ sendSellerMail:", sendSellerMail)
    console.log("🚀 ~ createOrderWithUser ~ sendMail:", sendCustomerMail)
    const finalRes = buildResponse({
      code: 200,
      body: {
        message: "Order placed successfully, futher you will notified by email.",
        sucess: true,
        order: orderSchema,
      },
    });
    console.log(finalRes, "final response")
    return finalRes


  } catch (error) {
    console.log("🚀 ~ createOrderWithUser ~ error:", error);
    return buildResponse({ code: 400, body: "bad request" });
  }
}

export async function updateOrder(body) {
  
}

export async function updateUser() { }



export async function getUser(queryParams) {
  try {
    const { email } = queryParams
    console.log("🚀 ~ getUser ~ email:", email)
    const getRecord = await getDynamoRecord({ dbName: 'users', keyObject: { email: email }, projection: 'complete_address, full_name, phone_nnumber' })
    console.log("🚀 ~ getUser ~ getRecord:", getRecord)
    if (getRecord.code !== 200) {
      return buildResponse({ code: 404, body: { sucess: false, message: "user not found" } })
    }
    return buildResponse({ code: 200, body: { sucess: true, message: "user found", result: getRecord } })
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error)
    return buildResponse({ code: 400, body: "bad request" });
  }
}