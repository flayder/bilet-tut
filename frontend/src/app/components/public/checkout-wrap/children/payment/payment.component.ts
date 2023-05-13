import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IPaymentItem } from 'src/app/exports/interfaces/IPaymentItem';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: '[data-app-payment]',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @Output() submit = new EventEmitter()
  @Output() payment = new EventEmitter()
  @Input() items: IBasketItem[] = []

  payments: IPaymentItem[] = []
  checked = false
  click: boolean = false

  constructor(
    private payment$: PaymentService
  ) { }

  ngOnInit(): void {
    this.payment$.payments.subscribe((payments: IPaymentItem[]) => {
      this.payments = payments
      if(payments.length > 0) {
        if(this.getRealPrice() != 0)
          this.payment.emit(payments[0].id)
        else {
          payments.map(pay => {
            if(pay.code == 'free') {
              this.payment.emit(pay.id)
            }
          })
        }
      }
    })
    this.payment$.getPayments({ordering: "id"})
  }

  getRealPrice() {
    let price = 0
    this.items.map((item: IBasketItem) => {
      price += (item.pricing * item.quantity)
    })
    
    return price
  }

  isKey(key: any, num: number) {
    return parseInt(key) == num
  }

  defaultCheck(key: any) {
    if(!this.checked) {
      this.checked = key
    }

    return key == this.checked
  }

  setValue(id: number) {
    this.payment.emit(id)
  }

  getValue(item: any, name: string) {
    if(item.hasOwnProperty(name))
      return item[name]

    return null
  }

  submitForm() {
    this.submit.emit(true)
    this.click = true

    setTimeout(() => {
      this.click = false
    }, 2000);
  }

}
