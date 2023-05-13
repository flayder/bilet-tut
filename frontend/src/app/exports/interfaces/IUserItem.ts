import { EmailValidator } from "@angular/forms"
import { ICountryItem } from "./ICountryItem"
import { IImageItem } from "./IImageItem"

export interface IUserItem {
    id: number
    login: string
    email: EmailValidator | null
    phone: any
    organisation_name: string | null
    is_email_validated: boolean
    legal_address: string | null
    ogrn: string | null
    inn: string | null
    tax: number
    kpp: string | null
    nds: boolean
    bank_name: string | null
    bik: string | null
    bank_account: string | null
    kor_name: string | null
    legal_first_name: string | null
    legal_name: string | null
    legal_last_name: string | null
    legal_role: string | null
    legal_state: string | null
    country: ICountryItem
    photo: IImageItem | null
    birthday: Date
    surname: string | null
    username: string | null
    lastname: string | null
    role: "admin" | "viewer" | "manager"
}
