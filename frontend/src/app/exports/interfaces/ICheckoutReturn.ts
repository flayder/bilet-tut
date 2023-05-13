import { ICheckoutItem } from "./ICheckoutItem"
import { ICheckoutReturnReason } from "./ICheckoutReturnReason"
import { ICheckoutReturnStatus } from "./ICheckoutReturnStatus"
import { IUserItem } from "./IUserItem"

export interface ICheckoutReturn {
    id: number
    name: string
    checkout: ICheckoutItem
    reason: ICheckoutReturnReason
    status: ICheckoutReturnStatus
    description: string
    seria_passport: string
    number_passport: string
    date_passport: string
    given_passport: string
    inn_bank: string
    bik_bank: string
    receipt_bank: string
    korr_bank: string
    user: IUserItem
    date: Date
    price: number
}
