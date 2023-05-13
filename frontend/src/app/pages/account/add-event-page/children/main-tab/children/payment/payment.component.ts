import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EVENT_DATA, EVENT_PAYMENT } from 'src/app/exports/constans';
import { IPaymentItem } from 'src/app/exports/interfaces/IPaymentItem';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: '[data-app-account-payment]',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Output() submit = new EventEmitter()
  @Output() payment = new EventEmitter()
  //@Input() val = new Subject
  value: any = false
  id: number = 0

  payments: IPaymentItem[] = []

  constructor(
    private payment$: PaymentService,
    private router$: ActivatedRoute
  ) { 
    this.router$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('event_id')) {
        this.id = params.event_id
      }
    })

    EVENT_DATA.subscribe((items: any) => {
      if(Array.isArray(items.payment) && items.payment.length > 0 && items.payment[0] != this.value) {
        this.value = items.payment[0]
        this.payment.emit(this.value)
        EVENT_PAYMENT.next(this.value)
      }
    })
  }

  ngOnInit(): void {
    this.payment$.payments.subscribe((payments: IPaymentItem[]) => {
      this.payments = payments
      if(this.id == 0 && payments.length > 0) {
        this.payment.emit(payments[0].id)
        EVENT_PAYMENT.next(payments[0])
      }
    })
    this.payment$.getPayments({ordering: "id"})
  }

  isKey(key: any, num: number) {
    return parseInt(key) == num
  }

  setValue(id: number) {
    this.payment.emit(id)
    this.payments.map(payment => {
      if(payment.id == id) {
        EVENT_PAYMENT.next(payment)
      }
    })
  }

  getValue(item: any, name: string) {
    if(item.hasOwnProperty(name))
      return item[name]

    return null
  }

  submitForm() {
    this.submit.emit(true)
  }

}
