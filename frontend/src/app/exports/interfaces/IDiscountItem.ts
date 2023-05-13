import { IEventItem } from "./IEventItem"
import { IUserItem } from "./IUserItem"

export interface IDiscountItem {
    id: number
    active: boolean
    name: string
    start_date: Date
    finish_date: Date
    count: number
    value: number
    point: string
    event: IEventItem
    user: IUserItem
}