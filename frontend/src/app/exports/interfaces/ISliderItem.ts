import { IEventItem } from "./IEventItem"
import { IEventType } from "./IEventType"
import { IImageItem } from "./IImageItem"

export interface ISliderItem {
    id: number
    name: string
    position: number
    is_banner: boolean
    title: string
    subtitle: string
    link: string
    date: Date
    image: IImageItem
    event: IEventItem | null
    type: IEventType | null
}
