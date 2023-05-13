import { EVENT_FIELDS } from "../constans"

export const SetEventLocalStorageData = (obj: any, clear = false) => {
    if(!clear) {
        const json: any = localStorage.getItem('eventForm')
        const form = JSON.parse(json)
        let changed = false
        if(form && typeof obj == "object") {
            for(let item in obj) {
                if(form.hasOwnProperty(item) && form[item] != obj[item]) {
                    form[item] = obj[item]
                    changed = true
                }
            }

            if(changed)
                localStorage.setItem('eventForm', JSON.stringify(form))
        }
    } else {
        localStorage.setItem('eventForm', JSON.stringify(EVENT_FIELDS))
    }
}