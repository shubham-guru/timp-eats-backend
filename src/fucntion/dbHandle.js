import { buildResponse } from "../helper/httpResponse.js";
import { createDynamoRecord } from "../middlewares/db.middlewares.js";
import  generateOrderSchema  from "../schema/orderSchema.js";
import { generateUSerSchema } from "../schema/userSchema.js";

export async function createOrderWithUser(details) {
  try {
    const { user, order } = JSON.parse(details);
    const UserSchema = generateUSerSchema(user);

    const createUser = await createDynamoRecord({
      dbName: "users",
      item: UserSchema,
      messages: {
        200: `user created successfully`,
      },
    });
    if(createUser.code !== 200) return buildResponse({code:400,body:{sucess:false,message:"Error in user creation"}})

    const orderSchema = generateOrderSchema(order,UserSchema.user_id)

    const createOrder = await createDynamoRecord({
        dbName: "order_data",
        item: orderSchema,
        messages: {
          200: `order created successfully`,
        },
      });
      if(createOrder.code !== 200) return buildResponse({code:400,body:{sucess:false,message:"Error in order creation"}})

    console.log('order detail', createOrder)

    return buildResponse({code: 200, body:{message:'user and order created successfully',sucess:true,order_id:orderSchema.order_id}})
  } catch (error) {
    console.log("🚀 ~ createOrderWithUser ~ error:", error);
    return buildResponse({ code: 400, body: "bad request" });
  }
}


export async function updateOrder(body){
 return buildResponse({code: 200, body: ""})
}

export async function updateUser(){

}