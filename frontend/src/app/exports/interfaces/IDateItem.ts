import { IEventAreaSchems } from "./IEventAreaSchems"
import { IEventItem } from "./IEventItem"

export interface IDateItem {
    id?: number
    start_date: Date | string
    finish_date: Date | string
    event?: IEventItem[]
    schemes?: IEventAreaSchems[]
}