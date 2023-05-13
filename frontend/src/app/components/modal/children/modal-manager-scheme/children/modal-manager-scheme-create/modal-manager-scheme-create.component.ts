import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScriptManagerSceneCreate } from 'src/app/exports/classes/ScriptManagerSceneCreate';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IDateItem } from 'src/app/exports/interfaces/IDateItem';
import { IEventAreaCategory } from 'src/app/exports/interfaces/IEventAreaCategory';
import { IEventAreaSchems } from 'src/app/exports/interfaces/IEventAreaSchems';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IEventPrice } from 'src/app/exports/interfaces/IEventPrice';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IPriceAndPlaceReference } from 'src/app/exports/interfaces/IPriceAndPlaceReference';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';

declare var $: any

@Component({
  selector: '[data-app-modal-manager-scheme-create]',
  templateUrl: './modal-manager-scheme-create.component.html',
  styleUrls: ['./modal-manager-scheme-create.component.css']
})
export class ModalManagerSchemeCreateComponent implements OnInit {

  @Input() schem: IEventAreaSchems
  @Input() event: IEventItem
  @Output() cancel = new EventEmitter()
  
  $id = RandomStringFunction()
  manager$: any
  
  prices: IEventPrice[] = []
  categories: IEventAreaCategory[] = []
  dates: IDateItem[] = []
  id: any = false
  id$ = RandomStringFunction()

  initiate: boolean = false
  
  constructor(
    private event$: EventService,
    private message$: MessageService,
    private dom$: DomSanitizer
  ) {
    const items = GetEventLocalStorageData()

    if(
      typeof items == "object" &&
      items.id > 0 &&
      this.id != items.id
    )
      this.id = items.id

    this.manager$ = new ScriptManagerSceneCreate(this.$id, this.message$)

    if(!this.event && !this.initiate) {
      this.initiate = true

      this.event$.getPrice({event__pk: this.id}).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.prices = response.results
          this.manager$.setPrice(this.prices, this.schem.id)
        }
      })

      this.event$.getAreaCategories({event__pk: this.id}).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.categories = response.results
          this.manager$.setCategory(this.categories.filter(c => Array.isArray(c.scheme) && c.scheme.filter(s => s == this.schem.id).length > 0))
        }
      })

      this.event$.getDates({event__pk: this.id}).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.dates = response.results
          this.manager$.setDate(this.dates.filter(d => Array.isArray(d.schemes) && d.schemes.filter(s => s.id == this.schem.id).length > 0))
        }
      })
    }
  }

  safe(html: string) {
    return this.dom$.bypassSecurityTrustHtml(html)
  }

  ngOnInit(): void {
    //console.log('this.event', this.event)
  }

  isDateActive(item: IDateItem) {
    return Array.isArray(item.schemes) && item.schemes.filter(i => i.id == this.schem.id).length > 0
  }

  isCategoryActive(item: IEventAreaCategory) {
    return Array.isArray(item.scheme) && item.scheme.filter(i => i == this.schem.id).length > 0
  }

  getAttr(attr: string, obj: any) {
    if(obj.hasOwnProperty(attr))
      return obj[attr]

    return ''
  }

  stringify(data: any) {
    return JSON.stringify(data)
  }

  close(event: any) {
    event.preventDefault()
    this.cancel.emit(true)
  }

  save() {
    let error = false
    if(this.manager$.dates.length == 0) {
      this.message$.handle('Вы не выбрали даты')
      error = true
    }

    if(!error) {
      const dates: number[] = []
      const values: IPriceAndPlaceReference[] = this.manager$.values
      const categories: number[] = []

      console.log('this.manager$.values', this.manager$.values)

      this.manager$.dates.map((date: IDateItem) => {
        if(date.id) {
          dates.push(date.id)
        }
      })

      this.manager$.categories.map((cat: IEventAreaCategory) => {
        if(cat.id) {
          categories.push(cat.id)
        }
      })

      const params: any = {dates, values, categories, scheme: this.schem.id}

      if(this.id > 0) 
        params.event = this.id

      this.event$.orgManager(params).subscribe((response: IHttpResponse) => {
        this.message$.handle('Изменения успешно применены', "success")
        this.cancel.emit(true)
      })
    }
  }

}
