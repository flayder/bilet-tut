import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IBasketItem } from '../exports/interfaces/IBasketItem';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { BilethttpService } from './bilethttp.service';
import { UserService } from './user.service';
import { IDiscountItem } from '../exports/interfaces/IDiscountItem';
import { ICheckoutReturn } from '../exports/interfaces/ICheckoutReturn';
import { RandomStringFunction } from '../exports/functions/RandomStringFunction';

@Injectable({
  providedIn: 'root'
})
export class BaoService {

  items: Subject<Array<IBasketItem>> = new Subject()
  response: Subject<IHttpResponse> = new Subject()
  discounts = new Subject<Array<IDiscountItem>>()
  returns = new Subject<Array<ICheckoutReturn>>()
  init: boolean = false

  constructor(
    private http$: BilethttpService,
    private user$: UserService
  ) { 
    http$.getErrors().subscribe(errors => {
      this.init = false
    })
  }

  getErrors() {
    return this.http$.getErrors()
  }

  //Добавление в корзину
  addBasket(data = {}) {
    return this.http$.post('/api/basket/add/', data)
  }

  //Генерировать ключ для корзины для неавторизированного пользователя
  getFUserKey() {
    let key = localStorage.getItem('f_user')
    
    if(!key || typeof key != 'string') {
      key = RandomStringFunction() + RandomStringFunction()
      localStorage.setItem('f_user', key)
    }
    
    return key
  }

  //Получение списка заказов пользователя
  getUserCheckoutList(id: number, data = {}) {
    return this.http$.get(`/api/checkout_user/${id}/`, data)
  }

  //Получение списка корзин пользователя
  getUserCheckouts(id: number, data = {}) {
    return this.http$.get(`/api/basket_user/${id}/`, data)
  }

  //Отправка билетов повторно на почту клиенту
  repeatBilets(id: number) {
    return this.http$.get(`/api/repeat_bilets/${id}/`)
  }

  //Осуществить возврат по заказу
  refundOrder(id: number) {
    return this.http$.get(`/api/refund_order/${id}/`)
  }

  //Получение списка скидок
  getDiscounts(params = {}, id = null) {
    const response = this.http$.get('/api/discount/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.discounts.next(response.results)
    })

    return response
  }
  
  //Получение данных конкретной скидки
  getDiscount(id: number, params = {}) {
    return this.http$.get(`/api/discount/${id}/`, params)
  }

  //Обновление данных скидки
  updateDiscount(id: number, data = {}) {
    return this.http$.put(`/api/discount/${id}/`, data)
  }

  //Удаление скидки
  deleteDiscount(id: number) {
    return this.http$.delete(`/api/discount/${id}/`)
  }

  //Добавление скидки
  addDiscount(data: object, params = {}) {
    return this.http$.post('/api/discount/', data, params)
  }

  //Получение данных статистики мероприятий
  getEventStatic(id: number, data = {}) {
    return this.http$.get(`/api/pay_static/${id}/`, data)
  }

  //Получение списка закаов
  getOrders(data = {}) {
    return this.http$.get("/api/account/checkout/", data)
  }

  //Получение список заказов одновременно с множественным выбором
  getOrdersInfo(id: number[]) {
    return this.http$.get("/api/account/orders/", {
      id: JSON.stringify(id)
    })
  }

  //Получение данных для страницы оформления заказа
  checkOut(data: {}) {
    const params: any = {}
    const f_user = localStorage.getItem('f_user')
    if(f_user) {
      params.f_user = f_user
    }
    if(!this.init) {
      this.init = true
      this.http$.post("/api/checkout/", data, params).subscribe((response: IHttpResponse) => {
        this.init = false
        this.response.next(response)
      })
    }
  }


  //Повторный заказ
  repeatOrder(checkout_id: number) {
    return this.http$.get(`/api/account/checkout/${checkout_id}/`)
  }


  //Получение данных корзины
  getCurrentBasket() {
    const params: any = {
      f_user: this.getFUserKey()
    }

    const discount = this.getLocalDiscount()
    if(discount)
      params.discount = discount.name

    if(!this.init) {
      this.init = true
      this.http$.get("/api/basket/", params).subscribe((response: IHttpResponse) => {
        this.init = false
        if(Array.isArray(response.results)) {
          this.items.next(response.results)
        }
      })
    }
  }


  //Удаление продукта из корзины
  removeProduct(id: number) {
    if(!this.init) {
      const params: any = {}
      const token = localStorage.getItem('token')
      const f_user = localStorage.getItem('f_user')

      if(!token && f_user)
        params.f_user = f_user
        
      this.http$.delete(`/api/basket/${id}/`, params).subscribe((response: IHttpResponse) => {
        this.init = false
        this.response.next(response)
      })
    }
  }

  //Получение списка статусов причин возврата
  getCRStatuses(params = {}) {
    return this.http$.get('/api/checkout_status/', params)
  }

  //Получение списка причин возврата
  getCRReasons(params = {}) {
    return this.http$.get('/api/checkout_reason/', params)
  }


  //Получение списка возвратов заказа
  getCheckoutReturns(params = {}) {
    const response = this.http$.get('/api/checkout_return/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.returns.next(response.results)
    })

    return response
  }
  
  //Получение детальной информации конкретного возрата заказа
  getCheckoutReturn(id: number, params = {}) {
    return this.http$.get(`/api/checkout_return/${id}/`, params)
  }

  //Применить скидку
  setDiscount(name: string) {
    return this.http$.post('/api/set_discount/', {discount: name})
  }

  //Получить скидку из локального хранилища
  getLocalDiscount() {
    const discount = localStorage.getItem('discount')
    if(typeof discount == 'string' && discount.length > 0) {
      const obj: any = JSON.parse(discount)
      if(typeof obj == "object")
        return obj
    }

    return false
  }


  //Обновление данных вовзрата заказа
  updateCheckoutReturn(id: number, data = {}) {
    return this.http$.put(`/api/checkout_return/${id}/`, data)
  }


  //Удаление возврата заказа
  deleteCheckoutReturn(id: number) {
    return this.http$.delete(`/api/checkout_return/${id}/`)
  }


  //Добавление возврата заказа
  addCheckoutReturn(data: object, params = {}) {
    return this.http$.post('/api/checkout_return/', data, params)
  }

  //admin
  admin = {
    //Получение списка корзин для админа
    getBasketList: (data = {}) => {
      return this.http$.get("/api/admin_basket/", data)
    }
  }

}
