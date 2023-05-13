import { IEventGenre } from "./IEventGenre"
import { IEventItem } from "./IEventItem"
import { IImageItem } from "./IImageItem"

export interface IRubricItem {
    id: number
    name: string
    position: number
    events: IEventItem[]
    genres: IEventGenre[]
    date: Date
    image: IImageItem
}
