import { ulid } from "ulid";
import { currentDate } from "../helper/utility.js";


export function generateUSerSchema(user_details){
    const user_id  = 'USER_'+ulid();

    const generated_user  = {
        user_id: user_id,
        email:user_details.email,
        phone_number:user_details.phone_number,
        full_name:user_details.full_name,
        complete_address:user_details.complete_address,
        createdAt: currentDate(),
        date: currentDate('dateString')										
    }

    return generated_user
}