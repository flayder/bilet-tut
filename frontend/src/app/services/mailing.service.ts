import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { BilethttpService } from './bilethttp.service';

@Injectable({
  providedIn: 'root'
})
export class MailingService {

  mailings = new Subject

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Получить список данных рассылок
  getMailings(params = {}, id = null) {
    const response = this.http$.get('/api/mailing/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.mailings.next(response.results)
    })

    return response
  }
  
  //Получить данные конкретной рассылки
  getMailing(id: number, params = {}) {
    return this.http$.get(`/api/mailing/${id}/`, params)
  }

  //Обновить данные рассылки
  updateMailing(id: number, data = {}) {
    return this.http$.put(`/api/mailing/${id}/`, data)
  }

  //Удалить данные рассылки
  deleteMailing(id: number) {
    return this.http$.delete(`/api/mailing/${id}/`)
  }

  //Добавить рассылку
  addMailing(data: object, params = {}) {
    return this.http$.post('/api/mailing/', data, params)
  }

}
