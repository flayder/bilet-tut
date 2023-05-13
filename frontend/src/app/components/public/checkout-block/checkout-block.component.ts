import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'tr[data-app-checkout-block]',
  templateUrl: './checkout-block.component.html',
  styleUrls: ['./checkout-block.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckoutBlockComponent implements OnInit {

  @Input() item: ICheckoutItem

  constructor(
    private bao$: BaoService,
    private message$: MessageService,
    private router$: Router
  ) { }

  ngOnInit(): void {
  }

  getTypes(item: IBasketItem) {
    return item.product.type.name
  }

  getQuantity() {
    let quant = 0
    this.item.products.map(i => {
      quant += i.quantity
    })

    return quant
  }

  repeatBilets(event: any) {
    event.target.disabled = true
    this.bao$.repeatBilets(this.item.id).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.message$.handle('Билеты успешно отправлены на почту клиента', 'success')
      } else {
        this.message$.handle('Билеты не были отправлены, пожалуйста повторите попытку позже или обратитесь в администрацию')
      }
    })
  }

  refundOrder(event: any) {
    event.target.disabled = true
    this.bao$.refundOrder(this.item.id).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.message$.handle('Запрос на возврат был успешно подан в обработку', 'success')
      } else {
        this.message$.handle('Запрос на возврат не был произведен, пожалуйста повторите попытку позже или обратитесь в администрацию')
      }
    })
  }

  getDiscount(item: IBasketItem) {
    return item.discount_price * item.quantity
  }

  getPrice(item: IBasketItem) {
    return item.pricing * item.quantity
  }

}
