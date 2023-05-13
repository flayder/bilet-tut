import { DiscountPointType } from "../types/DiscountPointType"
import { IUserItem } from "./IUserItem"

export interface ICheckoutDiscount {
    active: boolean
    name: string
    start_date: Date
    finish_date: Date
    count: number | undefined
    value: number
    point: DiscountPointType
    user: IUserItem
}