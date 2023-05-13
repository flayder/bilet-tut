import { IEventItem } from "./IEventItem"
import { IUserItem } from "./IUserItem"

export interface IMailingItem {
    id: number
    date: Date
    type: "sms" | "email"
    toeveryone: boolean
    text: string
    user_list: IUserItem[]
    event: IEventItem[]
    user: IUserItem
}