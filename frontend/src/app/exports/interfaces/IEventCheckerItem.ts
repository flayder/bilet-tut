import { IUserCheckerItem } from "./ICheckerItem"
import { ICheckoutItem } from "./ICheckoutItem"
import { IEventCheckerStatus } from "./IEventCheckerStatus"

export interface IEventCheckerItem {
    id: number
    checkout: ICheckoutItem
    checker: IUserCheckerItem
    status: IEventCheckerStatus
    date: Date
}