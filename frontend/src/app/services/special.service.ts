import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { Subject } from 'rxjs';
import { ISpecialItem } from '../exports/interfaces/ISpecialItem';

@Injectable({
  providedIn: 'root'
})
export class SpecialService {

  items = new Subject<ISpecialItem[]>()

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Получить список спецпредложений
  getSpecials(params = {}, id = null) {
    const response = this.http$.get('/api/special/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.items.next(response.results)
    })

    return response
  }
  
  //Получить данные конкретного спецпредложения
  getSpecial(id: number, params = {}) {
    return this.http$.get(`/api/special/${id}/`, params)
  }

  //Обновить спецпредложение
  updateSpecial(id: number, data = {}) {
    return this.http$.put(`/api/special/${id}/`, data)
  }

  //Удалить спецпредложение
  deleteSpecial(id: number) {
    return this.http$.delete(`/api/special/${id}/`)
  }

  //Добавить спецпредложение
  addSpecial(data: object, params = {}) {
    return this.http$.post('/api/special/', data, params)
  }
}
