import { SHORT_MONTHS } from "../constans"
export class DateRussian {

    static getShortMonth(num: any) {
      return SHORT_MONTHS[parseInt(num) - 1]
    }
}