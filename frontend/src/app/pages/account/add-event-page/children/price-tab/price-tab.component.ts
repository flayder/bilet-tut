import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EVENT_CITY, EVENT_DATA, EVENT_SUBJECT } from 'src/app/exports/constans';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { SetEventLocalStorageData } from 'src/app/exports/functions/SetEventLocalStorageData';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { ModalType } from 'src/app/exports/types/ModalType';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-price-tab]',
  templateUrl: './price-tab.component.html',
  styleUrls: ['./price-tab.component.css']
})
export class PriceTabComponent implements OnInit {

  discounts: any = []
  prices: any = []
  categories: any = []
  schem: false | IEventArea = false
  init = false
  error = false
  isArea = 0

  constructor(
    private modal$: ModalService,
    private param$: ActivatedRoute,
    private message$: MessageService
  ) { 
    

    EVENT_DATA.subscribe((items: any) => {
      if(
        typeof items == "object" && 
        typeof items.area == "object" && 
        items.area.hasOwnProperty('id')
      ) {
        this.isArea = items.area.id
        SetEventLocalStorageData({area: this.isArea})
      }
    })

    EVENT_CITY.subscribe((id: any) => {
      if(id > 0) {
        this.isArea = id
      }
    })
    
  }

  getArea() {
    //console.log('this.isArea', this.isArea)
    return this.isArea
  }

  // initiation() {
  //   const data = GetEventLocalStorageData()
  //   if(data.)
  // }

  // validation() {
  //   let err = false
  //   if(this.prices.length == 0) {
  //     this.message$.handle('Не созданы цены для мероприятия')
  //   }

  //   if(!this.schem) {
  //     this.message$.handle('Не выбрано место проведения мероприятия')
  //   } else {
  //     if(!this.schem.is_scheme) {
  //       if(this.prices.length == 0 && this.categories.length) {
  //         this.message$.handle('Для создания мероприятия нужно иметь цену или категорию')
  //       }
  //     }
  //   }
    
  // }

  setDiscounts(discounts: IDiscountItem[]) {
    this.discounts = discounts
  }

  setPrices(prices: any) {
    this.prices = prices
    if(prices.length > 0)
      SetEventLocalStorageData({price_is: true})
  }

  setCategories(categories: any) {
    this.categories = categories
    if(categories.length > 0)
      SetEventLocalStorageData({category_is: true})
  }

  setSchema(schem: any) {
    this.schem = schem
    if(typeof schem == "object" && schem.hasOwnProperty('id'))
      SetEventLocalStorageData({area: schem.id})
  }
  

  save() {
    const fieldsDefault: any = GetEventLocalStorageData()
    EVENT_SUBJECT.next(fieldsDefault)
  }

  ngOnInit(): void {
    this.init = true
  }

  openModal(name: ModalType) {
    this.modal$.open(name)
  }

}
