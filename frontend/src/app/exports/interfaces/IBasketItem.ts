import { IDateItem } from "./IDateItem"
import { IEventAreaCategory } from "./IEventAreaCategory"
import { IEventItem } from "./IEventItem"
import { IEventAreaPlaces } from "./IEventPlace"
import { IEventPrice } from "./IEventPrice"
import { IUserItem } from "./IUserItem"

export interface IBasketItem {
    id: number
    available: number
    product: IEventItem
    quantity: number
    place: IEventAreaPlaces | null
    price: IEventPrice | null
    discount_price: number
    category: IEventAreaCategory | null
    pricing: number
    date: IDateItem
    user: IUserItem | null
    f_user: string | null
    created_at: Date
}