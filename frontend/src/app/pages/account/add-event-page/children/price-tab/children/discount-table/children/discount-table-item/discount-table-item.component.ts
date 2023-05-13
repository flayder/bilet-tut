import { Component, Input, OnInit } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'tr[data-app-discount-table-item]',
  templateUrl: './discount-table-item.component.html',
  styleUrls: ['./discount-table-item.component.css']
})
export class DiscountTableItemComponent implements OnInit {

  @Input() item: IDiscountItem

  constructor(
    private modal$: ModalService,
    private bao$: BaoService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {

  }

  edit(id: number, event: any) {
    event.preventDefault()
    this.modal$.open('account-promocod-tiny', {
      edit: true,
      id
    })
  }

  delete(id: number, event: any) {
    event.preventDefault()

    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i: any) => {
      if(i == id$) {
        this.bao$.deleteDiscount(id).subscribe(response => {
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Промокод успешно удалена',
              buttonText: false
            })
          }, 200)

          const params: any = {event__pk: false}
          if(typeof this.item.event == "object") {
            if(this.item.event.id > 0) {
              params.event__pk = this.item.event.id
              params.user = this.item.event.user.id
            }
          }
          
          this.bao$.getDiscounts(params)
        })
      }
    })
    this.modal$.open('notification-tiny', {
      type: 'delete',
      id: id$,
      text: 'Вы действительно хотите удалить промокод?',
      buttonText: 'Удалить'
    })
  }

}
