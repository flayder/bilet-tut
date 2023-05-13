import { IImageItem } from "./IImageItem"

export interface IPaymentItem {
    id: number
    code: string
    name: string
    logo: IImageItem
}