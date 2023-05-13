import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IPromotionItem } from 'src/app/exports/interfaces/IPromotionItem';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'tr[data-app-wrap-promocode-page-item]',
  templateUrl: './wrap-promocode-page-item.component.html',
  styleUrls: ['./wrap-promocode-page-item.component.css']
})
export class WrapPromocodePageItemComponent implements OnInit {

  @Input() item: IPromotionItem

  constructor(
    private router$: Router,
    private event$: EventService,
    private message$: MessageService,
    private modal$: ModalService
  ) {}

  ngOnInit(): void {
  }

  edit(event: any) {
    event.preventDefault()
    this.router$.navigateByUrl(`/account/promocode/${this.item.id}`)
  }

  delete(event: any) {
    event.preventDefault()
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.event$.admin.deletePromotion(this.item.id).subscribe(respoense => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.event$.getPromotions()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Промоакция успешно удалена'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить промоакцию?',
      buttonText: 'Удалить'
    })
  }

  setRub(str: string) {
    if(str.indexOf("%") === -1) 
      return `${str} руб`
    return str
  }

  getDiscountValue() {
    switch (this.item.type) {
      case "TEMPLATE":
        if(this.item.template == "TWONE")
          return "2+1"
        return "3+1"

      case "DYNAMIC":
        return this.setRub(this.item.dynamic_sum)
    
      default:
        return this.setRub(this.item.fix_sum)
    }
  }

  getTypeValue() {
    switch (this.item.type) {
      case "FIX":
        return "Фиксированная"

      case "DYNAMIC":
        return "Динамическая"
    
      default:
        return "Фиксированная"
    }
  }

}
