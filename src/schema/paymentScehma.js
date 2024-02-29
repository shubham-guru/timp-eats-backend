import { ulid } from "ulid";
import { currentDate } from "../helper/utility.js";


// type IPaymentSchema ={
//     pay_id: string,
//     order_id,
//     razorpay_order_id: string,
//     razorpay_payment_id: string,
//     razorpay_signature: string,
//     createdAt: string|number,
//     date|number
// }

export function generatePaymentCreateSchema(payemnt_details){
    const pay_id= 'PAY_'+ulid();

    const generate_pay  ={
        pay_id: pay_id,
        order_id: payemnt_details.order_id,
        razorpay_order_id: payemnt_details.razorpay_order_id,
        payment_mode:payemnt_details.payment_mode,
        status:'unpaid',
        createdAt: currentDate(),
        date: currentDate('dateString')
      }

    return generate_pay
}
export function generateCODCreateSchema(payemnt_details){
    const pay_id= 'PAY_'+ulid();

    const generate_pay  ={
        pay_id: pay_id,
        razorpay_order_id:'COD_'+ulid(),
        order_id: payemnt_details.order_id,
        payment_mode:payemnt_details.payment_mode,
        status:'unpaid',
        createdAt: currentDate(),
        date: currentDate('dateString')
      }

    return generate_pay
}