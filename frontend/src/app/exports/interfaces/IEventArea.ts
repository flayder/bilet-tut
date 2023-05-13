import { ICityItem } from "./ICityItem"
import { IEventAreaSchems } from "./IEventAreaSchems"
import { IImageItem } from "./IImageItem"

export interface IEventArea {
    id: number
    name: string
    code: string,
    city: ICityItem
    is_scheme: boolean
    address: string
    location: {
        type: string,
        coordinates: any
    },
    gallery: Array<IImageItem>
    schems: Array<IEventAreaSchems>
}
