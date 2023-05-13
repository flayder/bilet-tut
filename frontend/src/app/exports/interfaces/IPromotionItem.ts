import { IEventItem } from "./IEventItem"
import { IUserItem } from "./IUserItem"

export interface IPromotionItem {
    id: number
    name: string
    event: IEventItem
    start_date: Date
    finish_date: Date
    type: 'TEMPLATE' | 'FIX' | 'DYNAMIC'
    fix_sum: string
    fix_count: number
    dynamic_sum: string
    dynamic_count: number
    template: 'TWONE' | 'THREEONE'
    template_descr: string
    user: IUserItem
}