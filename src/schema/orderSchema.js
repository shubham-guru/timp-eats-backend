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

export default function generateOrderSchema(order_details,user_id){
    const order_id = 'TIMP_'+ulid()

    const generated_user  = {
        order_id:order_id,
        user_id:user_id,
        payment_mode:order_details?.payment_mode || 'n/a',
        order_detail:order_details?.order_detail || [{product_name:'n/a', quantity:'n/a', unit:0, price:0}],
        delievery_charge:order_details?.delievery_charge || 0,
        tax:order_details?.tax || 0,
        total_price:order_details?.price || 0,
        tracking_id:order_details?.tracking_id || 'n/a',
        status:order_details?.status || 'order_placed',											  
        createdAt: currentDate(),
        date: currentDate('dateString')
        //TODO: updatedAt:
    }
    return generated_user
}