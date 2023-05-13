import { IBasketItem } from "./IBasketItem"
import { ICheckoutDiscount } from "./ICheckoutDiscount"
import { ICheckoutStatus } from "./ICheckoutStatus"
import { IPaymentItem } from "./IPaymentItem"
import { IUserItem } from "./IUserItem"

export interface ICheckoutItem {
    id: number
    discount: ICheckoutDiscount
    products: Array<IBasketItem>
    payment: IPaymentItem
    status: ICheckoutStatus
    user: IUserItem
    created_at: Date
    price: number
    discount_type: "percent" | "cash"
    discount_value: number
    total_price: number
}