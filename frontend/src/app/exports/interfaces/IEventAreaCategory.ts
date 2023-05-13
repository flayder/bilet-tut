import { IUserItem } from "./IUserItem"

export interface IEventAreaCategory {
    id: number
    name: string
    price: string
    color: string
    count: number
    description: string
    user: IUserItem
    active: boolean
    scheme: number[]
    basket: number
}
