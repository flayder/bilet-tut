import { Component, Input, OnInit } from '@angular/core';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IEventPrice } from 'src/app/exports/interfaces/IEventPrice';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'tr[data-app-price-table-item]',
  templateUrl: './price-table-item.component.html',
  styleUrls: ['./price-table-item.component.css']
})
export class PriceTableItemComponent implements OnInit {

  @Input() item: IEventPrice

  constructor(
    private modal$: ModalService,
    private event$: EventService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {

  }

  edit(id: number, event: any) {
    event.preventDefault()
    this.modal$.open('account-price-tiny', {
      edit: true,
      id
    })
  }

  delete(id: number, event: any) {
    event.preventDefault()
    const id$: any = RandomStringFunction()
    this.modal$.buttonClick.subscribe((i: any) => {
      if(i == id$) {
        this.event$.deletePrice(id).subscribe(response => {
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Цена успешно удалена',
              buttonText: false
            })
          }, 200)
          const params: any = {event__pk: false}
          const items: any = GetEventLocalStorageData()

          if(items.id > 0)
            params.event__pk = items.id

            this.event$.getPrice(params)
        })
      }
    })
    this.modal$.open('notification-tiny', {
      type: 'delete',
      id: id$,
      text: 'Вы действительно хотите удалить цену?',
      buttonText: 'Удалить'
    })
    
  }

}
