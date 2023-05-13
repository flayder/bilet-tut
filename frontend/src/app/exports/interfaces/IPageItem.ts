import { IElementPage } from "./IElementPage"

export interface IPageItem {
    id: number
    code: string
    h1: string
    content: string
    seo_title: string
    seo_description: string
    date: Date
    elements: IElementPage[]
}
