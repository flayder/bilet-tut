import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';

//Сервис для получение статических страниц

@Injectable({
  providedIn: 'root'
})
export class PageService {

  constructor(
    private http$: BilethttpService
  ) { }

  getPage(type: string, params = {}) {
    return this.http$.get(`/api/page/${type}`, params)
  }
}
