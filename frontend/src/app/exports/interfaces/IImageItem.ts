export interface IImageItem {
    id: number
    order: number
    image: {
        url: string,
        small: string,
        medium: string
        large: string
    }
    width: number
    height: number
    is_main: boolean
    is_deleted: boolean
    external_url: null | string
}
