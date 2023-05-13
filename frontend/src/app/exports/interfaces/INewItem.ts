import { IImageItem } from "./IImageItem"
import { IUserItem } from "./IUserItem"

export interface INewItem {
    id: number
    title: string
    subtitle: string
    content: string
    image: IImageItem
    user: IUserItem
    date: Date
}
