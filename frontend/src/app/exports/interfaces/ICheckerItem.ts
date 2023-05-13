import { IUserItem } from "./IUserItem"

export interface IUserCheckerItem {
    id: number
    username: string
    surname: string
    lastname: string
    phone: string
    email: string
    login: string
    password: string
    user: IUserItem
}