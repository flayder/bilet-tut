import { Component, Input, OnInit } from '@angular/core';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-schem-area-item]',
  templateUrl: './schem-area-item.component.html',
  styleUrls: ['./schem-area-item.component.css']
})
export class SchemAreaItemComponent implements OnInit {

  @Input() item: IEventArea

  constructor(
    private modal$: ModalService,
    private event$: EventService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {

  }

  openScheme(schem: any) {
    this.modal$.open('manager-scheme', {
      create: true,
      schem
    })
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
    this.event$.deletePrice(id).subscribe(response => {
      this.message$.handle('Цена успешно удалена', 'success')
      this.event$.getPrice()
    })
  }

}
