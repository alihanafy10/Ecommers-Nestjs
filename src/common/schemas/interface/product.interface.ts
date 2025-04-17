import { DiscountType } from "../../../common/shared";
import { Image } from "./user.interface";

export interface AppliedDiscount{
    amount: number;
    type: DiscountType;
}

export interface ProductImages{
    urls: Image[];
    customId: number;
}