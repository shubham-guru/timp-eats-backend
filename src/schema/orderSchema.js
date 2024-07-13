import { ulid } from "ulid";
import { currentDate } from "../helper/utility.js";

// type IUserDetail ={
//     order_id,
//     user_id,
//     payment_mode,
//     order_detail:Array<{product_name, quantity, unit, price}>,
//     delievery_charge,
//     tax,
//     total_price,
//     tracking_id,
//     status,											  
//     createdAt | number,
//     date: string | number
// }

export default function generateOrderSchema(order_details,amount,currency,user_id){
    const order_id = 'TIMP_'+ulid()

    const generated_user  = {
        order_id:order_id,
        user_id:user_id,
        payment_mode:order_details?.payment_mode || 'n/a',
        order_detail:order_details?.order_detail || [{product_name:'n/a', quantity:'n/a', unit:0, price:0}],
        delievery_charge:order_details?.delievery_charge || 0,
        tax:order_details?.tax || 0,
        amounts:amount || 0,
        currency:currency || 'USD',  // or 'INR' or 'EUR' or 'GBP' or 'AUD' or 'CAD' or 'JPY' or 'CHF' or 'CNY' or 'HKD' or 'SGD' or 'MYR' or 'ZAR' or 'EUR' or 'BRL' or 'ILS' or 'KRW' or 'PHP' or 'TWD' or 'THB' or 'TRY
        tracking_id:order_details?.tracking_id || 'n/a',
        order_status:order_details?.status || 'cart',											  
        createdAt: currentDate(),
        date: currentDate('dateString')
        //TODO: updatedAt:
    }
    return generated_user
}