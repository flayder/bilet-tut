import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { Subject } from 'rxjs';
import { ISliderItem } from '../exports/interfaces/ISliderItem';
import { IRubricItem } from '../exports/interfaces/IRubricItem';

@Injectable({
  providedIn: 'root'
})
export class DesignService {

  sliders = new Subject<ISliderItem[]>()
  rubrics = new Subject<IRubricItem[]>()

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Добавление слайдера
  addSlider(data: object, params = {}) {
    return this.http$.post('/api/admin_slider/', data, params)
  }

  //Получение списка слайдов
  getSliders(params = {}, id = null) {
    return this.http$.get('/api/slider/', params)
  }

  //Обновление слайда
  updateSlider(id: number, data = {}) {
    return this.http$.put(`/api/admin_slider/${id}/`, data)
  }

  //Удаление слайда
  deleteSlider(id: number) {
    return this.http$.delete(`/api/admin_slider/${id}/`)
  }

  //Получение слайда
  getSlider(id: number, data = {}) {
    return this.http$.get(`/api/admin_slider/${id}`, data)
  }

  
  //Добавление жанра мероприятия
  addRubric(data: object, params = {}) {
    return this.http$.post('/api/admin_rubric/', data, params)
  }

  //Получение жанра мероприятий
  getRubrics(params = {}, id = null) {
    const response = this.http$.get('/api/rubric/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.rubrics.next(response.results)
    })

    return response
  }

  //Обновление жанра мероприятий
  updateRubric(id: number, data = {}) {
    return this.http$.put(`/api/admin_rubric/${id}/`, data)
  }

  //Удаление жанра мероприятий
  deleteRubric(id: number) {
    return this.http$.delete(`/api/admin_rubric/${id}/`)
  }

  //Получение данных конкретного жанра мероприятия
  getRubric(id: number, data = {}) {
    return this.http$.get(`/api/admin_rubric/${id}`, data)
  }

}
