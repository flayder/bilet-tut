import { Component, OnInit, Input } from '@angular/core';
import { IEventItem } from '../../../../../../../exports/interfaces/IEventItem';
import { EventService } from 'src/app/services/event.service';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { BaoService } from 'src/app/services/bao.service';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { SHORT_MONTHS } from 'src/app/exports/constans';

@Component({
  selector: '[data-app-statistic-event-item]',
  templateUrl: './statistic-event-item.component.html',
  styleUrls: ['./statistic-event-item.component.css']
})
export class StatisticEventItemComponent implements OnInit {

  @Input() item: IEventItem
  @Input() user: IUserItem
  
  constructor(
    private event$: EventService,
    private message$: MessageService,
    private bao$: BaoService
  ) { }

  checkouts: number = -1
  total: number = 0

  ngOnInit(): void {
  }

  isAdmin() {
    return this.user && this.user.role == 'admin'
  }

  toActive(event: any) {
    this.event$.update(this.item.id, {status: event.target.checked ? '1' : '3'})
      .subscribe((response: IHttpResponse) => {
        if(response.results) {
          this.message$.handle('Данные успешно обновлены', 'success')
        }
      })
  }

  showPay() {
    this.bao$.getEventStatic(this.item.id).subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this.checkouts = response.results.length
        let price = 0
        response.results.map(order => {
          order.products.map((item: IBasketItem) => {
            if(item.product.id == this.item.id) {
              price += item.pricing * item.quantity
            }
          })
        })

        if(price > 0) {
          this.total = price
        }
      } else {
        this.checkouts = 0
      }
    })
  }

  setMonth(month: any) {
    return SHORT_MONTHS[month - 1]
  }

}
