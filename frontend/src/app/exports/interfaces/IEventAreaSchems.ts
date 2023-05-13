import { IEventAreaPlaces } from "./IEventPlace"
import { IImageItem } from "./IImageItem"

export interface IEventAreaSchems {
    id: number
    name: string
    schem: string
    preview: IImageItem[]
    places: IEventAreaPlaces[]
}
