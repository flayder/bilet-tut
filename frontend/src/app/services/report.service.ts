import { Injectable } from '@angular/core';
import { BilethttpService } from './bilethttp.service';
import { IReportItem } from '../exports/interfaces/IReportItem';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  reports = new Subject<Array<IReportItem>>()

  constructor(
    private http$: BilethttpService
  ) { }

  getErrors() {
    return this.http$.getErrors()
  }

  //Получить список отчетов
  getReports(params = {}, id = null) {
    const response = this.http$.get('/api/report/', params)
    response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.reports.next(response.results)
    })

    return response
  }
  
  //Получить данные конкретного отчета
  getReport(id: number, params = {}) {
    return this.http$.get(`/api/report/${id}/`, params)
  }

  //Обновить данные отчета
  updateReport(id: number, data = {}) {
    return this.http$.put(`/api/report/${id}/`, data)
  }

  //Удалить отчет
  deleteReport(id: number) {
    return this.http$.delete(`/api/report/${id}/`)
  }

  //Добавить отчет
  addReport(data: object, params = {}) {
    return this.http$.post('/api/report/', data, params)
  }
}
