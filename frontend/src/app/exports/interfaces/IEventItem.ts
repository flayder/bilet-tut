import { ICityItem } from "./ICityItem"
import { IEventAge } from "./IEventAge"
import { IEventArea } from "./IEventArea"
import { IEventGenre } from "./IEventGenre"
import { IEventStatus } from "./IEventStatus"
import { IEventType } from "./IEventType"
import { IImageItem } from "./IImageItem"
import { IPaymentItem } from "./IPaymentItem"
import { IUserItem } from "./IUserItem"

export interface IEventItem {
    id: number
    name: string
    is_active: boolean
    type: IEventType
    description: string | null
    tax: number
    favorite: boolean
    price: number[]
    start_date: any
    finish_date: Date
    is_showcase: boolean
    afisha: IImageItem
    area: IEventArea
    city: ICityItem
    genre: IEventGenre[]
    preview: IImageItem
    stage_image: IImageItem[]
    status: IEventStatus
    user: IUserItem
    age: IEventAge
    payment: IPaymentItem
}
