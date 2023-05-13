import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http$: BilethttpService
  ) { }
  
  //Создание формы обратной связи
  create(data: object, params: object = {}) {
    return this.http$.post('/api/feedback/', data, params)
  }

  //Получение данных формы
  getQuestions(params = {}) {
    return this.http$.get('/api/questions/', params)
  }
}
