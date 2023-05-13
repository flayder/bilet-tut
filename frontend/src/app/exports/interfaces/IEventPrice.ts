import { IEventAreaPlaces } from "./IEventPlace"
import { IUserItem } from "./IUserItem"

export interface IEventPrice {
    id: number
    price: string
    color: string
    raising: number
    date_to: Date | null
    place: IEventAreaPlaces[]
    user: IUserItem
    up_price: boolean
    basket: boolean
}
