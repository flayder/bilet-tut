import { IEventGenre } from "./IEventGenre"
import { IEventItem } from "./IEventItem"

export interface ISpecialItem {
  id: number
  name: string
  genres: IEventGenre[]
  events: IEventItem[]
  description: string
  date: Date
}