import { BehaviorSubject, Subject } from "rxjs"
import { ISelectValue } from "./interfaces/ISelectValue"
import { IFilterValue } from './interfaces/IFilterValue';
import { IEventItem } from "./interfaces/IEventItem";

export const HTTP_PROTOCOL = "http://"
export const SITE_URL = "localhost:8000"
//export const SITE_URL = "194.58.111.8:3001"

export const FORM_BUY_ITEMS = new Subject()
export const FORM_BUY_DATA = new Subject()

export const FORM_ERRORS: any = {
  required: "Это поле обязательное для заполнения",
  minlength: "Минимальное количество символов @num@",
  maxlength: "Максимальное количество символов @num@",
  email: "Некорректный email",
  phone: "Некорректный телефон",
  password: "Пароли не совпадают",
  passwordConfirm: "Пароли не совпадают",
  pattern: "Некорректное значение поля",
  policy: "Вам нужно подтвердить свое согласие на принятие условий конфидициальности перед отправкой формы"
}

export const SELECT_BOOLEAN: ISelectValue[] = [
  {
    name: "Да",
    value: 1
  },
  {
    name: "Нет",
    value: 0
  }
]

export const ORGANISATION_LIST: ISelectValue[] = [
  {
    name: "ООО",
    value: "ООО"
  }
]

export const TIME_LIST = [
  {
    name: "00:00",
    value: "00:00"
  },
  {
    name: "00:30",
    value: "00:30"
  },
  {
    name: "01:00",
    value: "01:00"
  },
  {
    name: "01:30",
    value: "01:30"
  },
  {
    name: "02:00",
    value: "02:00"
  },
  {
    name: "02:30",
    value: "02:30"
  },
  {
    name: "03:00",
    value: "03:00"
  },
  {
    name: "03:30",
    value: "03:30"
  },
  {
    name: "04:00",
    value: "04:00"
  },
  {
    name: "04:30",
    value: "04:30"
  },
  {
    name: "05:00",
    value: "05:00"
  },
  {
    name: "05:30",
    value: "05:30"
  },
  {
    name: "06:00",
    value: "06:00"
  },
  {
    name: "06:30",
    value: "06:30"
  },
  {
    name: "07:00",
    value: "07:00"
  },
  {
    name: "07:30",
    value: "07:30"
  },
  {
    name: "08:00",
    value: "08:00"
  },
  {
    name: "08:30",
    value: "08:30"
  },
  {
    name: "09:00",
    value: "09:00"
  },
  {
    name: "09:30",
    value: "09:30"
  },
  {
    name: "10:00",
    value: "10:00"
  },
  {
    name: "10:30",
    value: "10:30"
  },
  {
    name: "11:00",
    value: "11:00"
  },
  {
    name: "11:30",
    value: "11:30"
  },
  {
    name: "12:00",
    value: "12:00"
  },
  {
    name: "12:30",
    value: "12:30"
  },
  {
    name: "13:00",
    value: "13:00"
  },
  {
    name: "13:30",
    value: "13:30"
  },
  {
    name: "14:00",
    value: "14:00"
  },
  {
    name: "14:30",
    value: "14:30"
  },
  {
    name: "15:00",
    value: "15:00"
  },
  {
    name: "15:30",
    value: "15:30"
  },
  {
    name: "16:30",
    value: "16:30"
  },
  {
    name: "17:00",
    value: "17:00"
  },
  {
    name: "17:30",
    value: "17:30"
  },
  {
    name: "18:00",
    value: "18:00"
  },
  {
    name: "18:30",
    value: "18:30"
  },
  {
    name: "19:00",
    value: "19:00"
  },
  {
    name: "19:30",
    value: "19:30"
  },
  {
    name: "20:00",
    value: "20:00"
  },
  {
    name: "20:30",
    value: "20:30"
  },
  {
    name: "21:00",
    value: "21:00"
  },
  {
    name: "21:30",
    value: "21:30"
  },
  {
    name: "22:00",
    value: "22:00"
  },
  {
    name: "22:30",
    value: "22:30"
  },
  {
    name: "23:00",
    value: "23:00"
  },
  {
    name: "23:30",
    value: "23:30"
  }
]

export const EVENT_FIELDS : any = {
  id: 0,
  name: '',
  is_active: false,
  type: [],
  description: '',
  tax: '',
  price_is: false,
  category_is: false,
  is_showcase: false,
  afisha: '',
  area: 0,
  city: 0,
  genre: [],
  preview: '',
  stage_image: '',
  status: 2,
  age: '',
  payment: '',
}

export const STATIC_EVENTS = new Subject<IEventItem[]>()
export const STATIC_EVENT_RESPONSE = new Subject<any>()
export const STATIC_EVENT_PARAMS = new Subject<any>()

export const TAGS_LIST = new BehaviorSubject<IFilterValue[]>([])
export const TAG_REMOVE = new Subject()

export const EVENT_CITY = new Subject()
export const EVENT_DATA = new Subject()
export const EVENT_PAYMENT = new Subject()
export const EVENT_SUBJECT: BehaviorSubject<any> = new BehaviorSubject(EVENT_FIELDS)

export const TAXES_LIST: ISelectValue[] = [
  {
    name: "Система налогооблажения",
    value: "Система налогооблажения"
  }
]

export const LEGAL_STATE_LIST: ISelectValue[] = [
  {
    name: "Действующий на основании",
    value: "Действующий на основании"
  }
]

export const PHONE_REG_EXP = /^\+7\([0-9]{3}\)\s[0-9]{3}\-[0-9]{2}\-[0-9]{2}$/

export const MONTHS: any = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
]

export const SHORT_MONTHS: any = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек'
]
