import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { BilethttpService } from './bilethttp.service';
import { IEventItem } from '../exports/interfaces/IEventItem';
import { IEventGenre } from '../exports/interfaces/IEventGenre';
import { IPromotionItem } from '../exports/interfaces/IPromotionItem';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events = new Subject<IEventItem[]>()
  response = new Subject<IHttpResponse>()
  url = new Subject()
  prices = new Subject()
  areaCategories = new Subject()
  schemArea = new Subject()
  promotions = new Subject<IPromotionItem[]>()
  init: boolean = false

  constructor(
    private http: BilethttpService
  ) { }

  getErrors() {
    return this.http.getErrors()
  }

  getEventCheckin(params: object = {}) {
    const response = this.http.get('/api/event_checkin/', params)
    // response.subscribe(response => {
    //   if(Array.isArray(response.results)) {
    //     this.events.next(response.results)
    //   }
    //   this.url.next('/api/event/')
    //   this.response.next(response)
    // })
    return response
  }

  //Получение списка мероприятий
  getList(params: any = {}) {
    const response = this.http.get('/api/event/', params)
    // response.subscribe(response => {
    //   if(Array.isArray(response.results)) {
    //     this.events.next(response.results)
    //   }
    //   this.url.next('/api/event/')
    //   this.response.next(response)
    // })
    return response
  }


  //Создание мероприятия
  create(data: object, params: object = {}) {
    return this.http.post('/api/event/add/', data, params)
  }

  //Обновление мероприятия
  update(id: number, data = {}) {
    return this.http.post(`/api/event/update/${id}/`, data)
  }

  //Получение данных конкретного мероприятия
  getDetail(id: number, params: object = {}) {
    const response = this.http.get(`/api/event/${id}/`, params)
    //this.response.next(response)
    this.url.next(`/api/event/${id}/`)
    return response
  }

  //Добавление цен мероприятия
  addPrice(data: object, params = {}) {
    return this.http.post('/api/event_price/', data, params)
  }

  //Получение цены мероприятия
  getPrice(params = {}, id = null) {
    const response = this.http.get('/api/event_price/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.prices.next(response.results)
    })

    return response
  }

  //Обновление цены мероприятия
  updatePrice(id: number, data = {}) {
    return this.http.put(`/api/event_price/${id}/`, data)
  }

  //Удаление цены мероприятия
  deletePrice(id: number) {
    return this.http.delete(`/api/event_price/${id}/`)
  }

  //Получение данных конкретной цены мероприятия
  getPriceDetail(id: number, params = {}) {
    return this.http.get(`/api/event_price/${id}/`, params)
  }

  //Добавление категорий цен мероприятия
  addAreaCategory(data: object, params = {}) {
    return this.http.post('/api/event_area_category/', data, params)
  }

  //Получение списка категорий цен мероприятия
  getAreaCategories(params = {}, id = null) {
    const response = this.http.get('/api/event_area_category/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.areaCategories.next(response.results)
    })

    return response
  }

  //Обновление данных категории цен мероприятия
  updateAreaCategory(id: number, data = {}) {
    return this.http.put(`/api/event_area_category/${id}/`, data)
  }

  //Удаление категории цен мероприятия
  deleteAreaCategory(id: number) {
    return this.http.delete(`/api/event_area_category/${id}/`)
  }

  //Получение данных конкретной категории цен мероприятия
  getAreaCategoryDetail(id: number, params = {}) {
    return this.http.get(`/api/event_area_category/${id}/`, params)
  }

  //Добавление шаблона для печати мероприятия
  addMailTemplate(data: object, params = {}) {
    return this.http.post('/api/event_mail_template/', data, params)
  }

  //Получение данных конкретного шаблона для печати мероприятия
  getMailTemplates(params = {}, id = null) {
    return this.http.get('/api/event_mail_template/', params)
  }

  //Обновление шаблона для печати мероприятия
  updateMailTemplate(id: number, data = {}) {
    return this.http.put(`/api/event_mail_template/${id}/`, data)
  }

  //Удаление шаблона для печати мероприятия
  deleteMailTemplate(id: number) {
    return this.http.delete(`/api/event_mail_template/${id}/`)
  }

  //Получение данных шаблона для печати мероприятия
  getMailTemplate(id: number, params = {}) {
    return this.http.get(`/api/event_mail_template/${id}/`, params)
  }


  //Получение списка площадок мероприятия
  getArea(params: object = {}) {
    const response = this.http.get('/api/event_area/', params)
    //this.response.next(response)
    this.url.next('/api/event_area/')
    return response
  }

  //Получение данных площадки мероприятия
  getAreaDetail(id: number, params = {}) {
    return this.http.get(`/api/event_area/${id}/`, params)
  }

  //Получение списка мест мероприятия
  getGenre(params: object = {}) {
    const response = this.http.get('/api/event_genre', params)
    //this.response.next(response)
    this.url.next('/api/event_genre/')
    return response
  }

  //Получение данных конкретного места мероприятия
  getPlaceDetail(id: number, params = {}) {
    return this.http.get(`/api/event_place/${id}/`, params)
  }

  //Получение списка мест мероприятия
  getPlaces(params: object = {}) {
    const response = this.http.get('/api/event_place', params)
    //this.response.next(response)
    this.url.next('/api/event_genre/')
    return response
  }

  //Добавление или удаление избранных мероприятий для текущего пользователя
  toggleFavorite(id: number) {
    return this.http.get('/api/event/favorite/', {
      id
    })
  }

  //Получение списка дат мероприятий
  getDates(params: object = {}) {
    return this.http.get('/api/event_date/', params)
  }

  //Получение списка промоакций мероприятия
  getPromotions(params: object = {}) {
    this.http.get('/api/event_promotion/', params).subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this.promotions.next(response.results)
      }
    })
  }

  //Отправка данных менеджера схем
  orgManager(data: object = {}) {
    return this.http.post("/api/event/org_manager/", data)
  }

  //Получение информации о доступных местах и их цен с категориями для зала
  getSellInfo(data: object = {}) {
    return this.http.post("/api/event/sell_info/", data)
  }

  admin = {
    //Обновление данных жанра мероприятия для админа
    updateGenre: (id: number, data = {}) => {
      return this.http.put(`/api/admin_event_genre/${id}/`, data)
    },
    //Удаление данных жанра мероприятия для админа
    deleteGenre: (id: number) => {
      return this.http.delete(`/api/admin_event_genre/${id}/`)
    },
    //Получение данных жанра мероприятия для админа
    getGenreDetail: (id: number, params = {}) => {
      return this.http.get(`/api/admin_event_genre/${id}/`, params)
    },
    //Добавление жанра мероприятия для админа
    addGenre: (data: object, params = {}) => {
      return this.http.post('/api/admin_event_genre/', data, params)
    },
    //Обновление данных дат мероприятия для админа
    updateDate: (id: number, data = {}) => {
      return this.http.put(`/api/admin_event_date/${id}/`, data)
    },
    //Удаление даты мероприятия
    deleteDate: (id: number, data = {}) => {
      return this.http.delete(`/api/admin_event_date/${id}/`, data)
    },
    //Получение данных даты мероприятия для админа
    getDateDetail: (id: number, params = {}) => {
      return this.http.get(`/api/admin_event_date/${id}/`, params)
    },
    //Добавление данных даты мероприятия для админа
    addDate: (data: object, params = {}) => {
      return this.http.post('/api/admin_event_date/', data, params)
    },
    //Обновление данных промоакций мероприятия для админа
    updatePromotion: (id: number, data = {}) => {
      return this.http.put(`/api/admin_event_promotion/${id}/`, data)
    },
    //Удаление промоакций мероприятия
    deletePromotion: (id: number, data = {}) => {
      return this.http.delete(`/api/admin_event_promotion/${id}/`, data)
    },
    //Получение данных промоакций мероприятия для админа
    getPromotionDetail: (id: number, params = {}) => {
      return this.http.get(`/api/admin_event_promotion/${id}/`, params)
    },
    //Добавление данных промоакций мероприятия для админа
    addPromotion: (data: object, params = {}) => {
      return this.http.post('/api/admin_event_promotion/', data, params)
    }
  }
}
