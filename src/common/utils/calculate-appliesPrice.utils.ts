import { AppliedDiscount } from "../schemas";
import { DiscountType } from "../shared";

/**
 * 
 * @param {number}price 
 * @param {AppliedDiscount}discount 
 * 
 * @returns {number} appliedPrice
 */
export const calculateAPPliesPrice = (price:number, discount:AppliedDiscount):number => {
    let appliedPrice:number=price;
     if (discount.type == DiscountType.PERCENT) {
       appliedPrice = price - (price * discount.amount) / 100;
     } else if (discount.type == DiscountType.FIXED) {
       appliedPrice = price - discount.amount;
    } 
    return appliedPrice
}