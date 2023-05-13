import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';
import { INewItem } from '../exports/interfaces/INewItem';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  items = new Subject<INewItem[]>()

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Получить список новостей
  getList(data = {}) {
    const response = this.http$.get("/api/news/list/", data)
    response.subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this.items.next(response.results)
      }
    })
  }

  //Получить данные конкретной новости
  getNewDetail(id: number, params = {}) {
    return this.http$.get(`/api/news/${id}/`, params)
  }

  //Обновить данные новости
  updateNew(id: number, data = {}) {
    return this.http$.put(`/api/news/${id}/`, data)
  }

  //Удалить новость
  deleteNew(id: number) {
    return this.http$.delete(`/api/news/${id}/`)
  }

  //Добавить новость
  addNew(data: object, params = {}) {
    return this.http$.post('/api/news/', data, params)
  }
}
