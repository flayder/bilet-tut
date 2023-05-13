import { IUserItem } from "./IUserItem"

export interface ILoggingItem {
    id: number
    action: string
    user: IUserItem
    date: Date
}
