import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';
import { ILoggingItem } from '../exports/interfaces/ILoggingItem';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  items = new Subject<ILoggingItem[]>()

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Получить данные логирования
  getList(data = {}) {
    const response = this.http$.get("/api/logging/", data)
    response.subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this.items.next(response.results)
      }
    })
  }
}
