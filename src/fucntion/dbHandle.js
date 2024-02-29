import { buildResponse } from "../helper/httpResponse.js";
import { createDynamoRecord, getDynamoRecord } from "../middlewares/db.middlewares.js";
import generateOrderSchema from "../schema/orderSchema.js";
import { generateUSerSchema } from "../schema/userSchema.js";
import { checkout } from "./paymentHandle.js";

export async function createOrderWithUser(details) {
  try {
    const { user, order, amount } = JSON.parse(details);
    const UserSchema = generateUSerSchema(user);
    const orderSchema = generateOrderSchema(order, UserSchema.user_id);

    const [createUser, createOrder, checkoutOrder] = (await Promise.allSettled([
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
      }),
      await checkout({
        amount,
        order_id: orderSchema.order_id,
        payment_mode:orderSchema.payment_mode,
      }),
    ])).map(({status,value})=>value)
    console.log("🚀 ~ createOrderWithUser ~ createUser:", createUser)
    console.log("🚀 ~ createOrderWithUser ~ checkoutOrder:", checkoutOrder)
    console.log("🚀 ~ createOrderWithUser ~ createOrder:", createOrder)

    if (createOrder.code !== 200)
      return buildResponse({
        code: 400,
        body: { sucess: false, message: "Error in order creation" },
      });

    if (createUser.code !== 200)
      return buildResponse({
        code: 400,
        body: { sucess: false, message: "Error in user creation" },
      });

    if (checkoutOrder.statusCode !== 200)
      return buildResponse({
        code: 400,
        body: { sucess: false, message: "Error in creating payment" },
      });

    return buildResponse({
      code: 200,
      body: {
        message: "user and order created successfully",
        sucess: true,
        order: JSON.parse(checkoutOrder.body).order,
      },
    });
  } catch (error) {
    console.log("🚀 ~ createOrderWithUser ~ error:", error);
    return buildResponse({ code: 400, body: "bad request" });
  }
}

export async function updateOrder(body) {
  return buildResponse({ code: 200, body: "" });
}

export async function updateUser() {}



export async function getUser(queryParams){
  try {
    const{email} = queryParams
    console.log("🚀 ~ getUser ~ email:", email)
    const getRecord = await getDynamoRecord({ dbName:'users', keyObject:{email:email}, projection: 'complete_address, full_name, phone_nnumber'})
    console.log("🚀 ~ getUser ~ getRecord:", getRecord)
    if(getRecord.code !== 200){
      return buildResponse({ code: 404, body:{sucess:false, message:"user not found"}})
    }
    return buildResponse({ code: 200, body:{sucess:true, message:"user found",result:getRecord}})
  } catch (error) {
    console.log("🚀 ~ getUser ~ error:", error)
    return buildResponse({ code: 400, body: "bad request" });
  }
}