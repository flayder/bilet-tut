import { IReportPeriod } from "./IReportPeriod"
import { IReportType } from "./IReportType"
import { IUserItem } from "./IUserItem"

export interface IReportItem {
    id: number
    active: boolean
    date: Date
    type: IReportType
    period: IReportPeriod
    user: IUserItem
}
