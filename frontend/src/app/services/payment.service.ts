import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IHttpResponse } from '../exports/interfaces/IHttpResponse';
import { IPaymentItem } from '../exports/interfaces/IPaymentItem';
import { BilethttpService } from './bilethttp.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  payments: Subject<IPaymentItem[]> = new Subject()
  init: boolean = false

  constructor(
    private http$: BilethttpService
  ) { 
    http$.getErrors().subscribe(errors => {
      this.init = false
    })
  }

  //Получить список платежных систем 
  getPayments(params = {}) {
    if(!this.init) {
      this.init = true
      this.http$.get('/api/payment/', params).subscribe((response: IHttpResponse) => {
        this.init = false
        if(Array.isArray(response.results))
          this.payments.next(response.results)
      })
    }
  }
}
