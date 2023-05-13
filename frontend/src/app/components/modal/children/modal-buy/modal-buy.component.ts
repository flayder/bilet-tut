import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IDateItem } from 'src/app/exports/interfaces/IDateItem';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { BaoService } from 'src/app/services/bao.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';
import { EventService } from 'src/app/services/event.service';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { formatDate } from '@angular/common';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IEventPrice } from 'src/app/exports/interfaces/IEventPrice';
import { IEventAreaCategory } from 'src/app/exports/interfaces/IEventAreaCategory';
import { IEventAreaSchems } from 'src/app/exports/interfaces/IEventAreaSchems';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { MessageService } from 'src/app/services/message.service';
import { IEventAreaPlaces } from 'src/app/exports/interfaces/IEventPlace';
import { ScriptBuyService } from 'src/app/services/script-buy.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

declare var $:any

@Component({
  selector: 'div[data-app-modal-buy]',
  templateUrl: './modal-buy.component.html',
  styleUrls: ['./modal-buy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalBuyComponent implements OnInit {

  modal: ModalType = 'buy'
  format = 'dd.MM.yyyy'
  locale = 'en-US'
  time = 'HH:mm'

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams
  $id = RandomStringFunction()
  tab: string = 'main'
  event: IEventItem
  dates: IDateItem[] = []
  times: IDateItem[] = []
  select_date: IDateItem
  areas: ISelectValue[] = []
  area: number = 0
  params$: any = {}

  prices: IEventPrice[] = []
  categories: IEventAreaCategory[] = []

  places: any[] = []
  cats: any[] = []
  clickto: boolean = false

  constructor(
    private modal$: ModalService,
    private message$: MessageService,
    private bao$: BaoService,
    private user$: UserService,
    private event$: EventService,
    private manager$: ScriptBuyService,
    private router$: Router
  ) {
    this.manager$.setId(this.$id)
    this.manager$.getting.subscribe((data: any) => {
      let i = 0
      const int = setTimeout(() => {
        $('.modal__layout .tabs__item_active:eq(0)').click()
        i++
        if(i == 1) {
          clearInterval(int)
        }
      }, 100)
      let id = data.place_id
      let price_id = data.price_id
      
      if(data.action == 'add') {
        this.message$.handle('Билет выбран', 'success'); 
        
      } else {
        this.message$.handle('Билет убран', 'success')
      }

      const places = this.places

      if(places.filter(i => i.place_id == id && i.price_id == price_id).length > 0) {
        let key: any = false
        places.map((i, k) => {
          if(i.place_id == id && i.price_id == price_id)
            key = k
        })

        if(key > 0) {
          places.splice(key, 1)
        }
      } else {
        places.push({place_id: id, price_id})
      }

      this.places = places
    })
  }
    

  ngOnInit(): void {
    if(this.params.type == this.modal) {
      this.event = this.params.params.event
      this.getAreas()

      if(this.areas.length > 0) {
        this.area = this.areas[0].value
      }

      const params: any = {event: this.event.id, user: false}

      if(this.area)
        params['schemes'] = this.area

      this.init(params)
      //this.manager$.setPrice(this.prices, this.area)
      this.manager$.clicking()
    }
  }

  getScheme() {
    const scheme: IEventAreaSchems = this.event.area.schems.filter(i => i.id == this.area)[0]
    return scheme
  }

  selectFirstActualDate() {
    //console.log('selectFirstActualDate')
    const today: number = new Date(formatDate(new Date, 'yyyy-MM-dd', this.locale)).valueOf()
    const times: number[] = []
    const ids: number[] = []

    this.dates.map(date => {
      const time: number = new Date(date.start_date).valueOf()
      if(time > today) {
        times.push(time)
        if(date.id && date.id > 0)
          ids.push(date.id)
      }
    })

    this.dates.map((item: IDateItem) => {
      if(item.id == ids[times.indexOf(Math.min.apply(Math, times))])
        this.select_date = item
    })

    this.getTimes()

  }

  getActualDate() {
    return formatDate(this.select_date.start_date, this.format, this.locale)
  }

  getActualTime() {
    return formatDate(this.select_date.start_date, this.time, this.locale)
  }

  getArea(area: number) {
    //console.log('area')
    this.area = area
    const params: any = {event: this.event.id, user: false}

    if(this.area)
      params['schemes'] = this.area

    this.init(params)
  }

  getAreas() {
    //console.log('areas')
    const arr: ISelectValue[] = []
    this.event.area.schems.map(area => {
      arr.push({
        name: area.name,
        value: area.id
      })
    })

    this.areas = arr
  }

  getTimes(date: string = '') {
    //console.log('getTimes')
    if(!date && this.select_date) {
      date = formatDate(this.select_date.start_date, this.format, this.locale)
    }

    if(date) {
      this.times = this.dates.filter(item => formatDate(item.start_date, this.format, this.locale) == date)
    }

    if(this.dates.length == 1 && this.times.length == 1) {
      this.getTime(this.times[0])
    }
  }

  getDate(date: string) {
    //console.log('getDate')
    this.getTimes(date)
  }

  init(params = {}) {
    //console.log('init')
    this.event$.getDates(params).subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this.dates = response.results
        this.selectFirstActualDate()
      } 
    })
  }

  setTab(name: string) {
    //console.log('setTab')
    this.tab = name
  }

  toDateTimestamp(date: any) {
    return new Date(date).valueOf()
  }

  toDateTime(date: any) {
    return formatDate(date, this.time, this.locale)
  }

  isChecked(date: IDateItem) {
    if(this.select_date && date && this.select_date.id == date.id)
      return true

    return false
  }

  getTime(date: IDateItem) {
    //console.log('setTime')
    this.select_date = date
    this.event$.getSellInfo({date: this.select_date.id, event: this.event.id, scheme: this.area})
      .subscribe((response: IHttpResponse) => {
        if(response.results && typeof response.results == "object") {
          if(response.results.hasOwnProperty('prices') && Array.isArray(response.results.prices)) {
            this.prices = response.results.prices
            this.manager$.setPrice(this.prices, this.area)
          }

          if(response.results.hasOwnProperty('categories') && Array.isArray(response.results.categories))
            this.categories = response.results.categories
        }
      })
  }

  getNow() {
    //console.log('now')
    return Date.now()
  }

  getUpdated(event: any) {
    
    if(this.prices.length > 0) {
      this.manager$.setPrice(this.prices, this.area)
      this.manager$.clicking()
    }
  }

  buy() {
    this.clickto = true

    setTimeout(() => {
      this.clickto = false
    }, 500)
    
    if(this.places.length == 0 && this.cats.length == 0) {
      this.message$.handle('Не выбран не один товар!')
      return
    }

    // const timeout = setTimeout(() => {
    //   // this.modal$.open('notification-tiny', {
    //   //   type: 'error',
    //   //   text: 'Произошла ошибка добавления товаров, если при переходе в выбранные товары не появились, пожалуйста повторите попытку или обратитесь в администрацию'
    //   // })
    //   this.router$.navigate(['/basket'])
    // }, 10000)

    const done = new Subject()

    // done.subscribe(ok => {
    //   this.close()
    //   clearTimeout(timeout)
    //   this.manager$.prices = []
    //   // this.modal$.open('notification-tiny', {
    //   //   type: 'success',
    //   //   text: 'Все товары успешно добавлены в корзину'
    //   // })
      
    // })

    //const params: any = 

    //console.log('param 1', params)
    //console.log('this.cats', this.cats)
    //console.log('this.places', this.places)
    const user = this.user$.currentUser
    var i = 0
    this.cats.map(cat => {
      let param$: any = {
        product: this.event.id,
        date: this.select_date.id,
        category: cat.id,
        quantity: cat.quantity
      }

      if(typeof user != 'object')
        param$.f_user = this.bao$.getFUserKey()

      
      this.bao$.addBasket(param$).subscribe(res => {
        i++
        if(this.cats.length == i && this.places.length == 0)
          done.next(true)

        console.log('cat params', param$, i, this.cats.length)
      })
    })

    var i = 0
    this.places.map(pl => {
      let param$: any = {
        product: this.event.id,
        date: this.select_date.id,
        place: pl.place_id,
        price: pl.price_id,
        quantity: 1
      }
      
      if(typeof user != 'object')
        param$.f_user = this.bao$.getFUserKey()

      
      this.bao$.addBasket(param$).subscribe(res => {
        // i++
        // if(this.places.length == i)
        //   done.next(true)

        //console.log('prod params', param$, i, this.places.length)
      })
      
    })


    setTimeout(() => {
      this.close()
      this.message$.handle('Все товары успешно добавлены в корзину', 'success')
      this.router$.navigate(['/basket'])
    }, 1000);
  }

  getCategoryPrice(cat: IEventAreaCategory) {
    return cat.price
  }

  getQuantity(quantity: number, cat: IEventAreaCategory) {
    const cats = this.cats
    if(cats.filter(i => i.id == cat.id).length > 0) {
      cats.map((c, k) => {
        if(c.id == cat.id)
          cats[k].quantity = quantity
      })
    } else {
      cats.push({id: cat.id, quantity})
    }

    this.cats = cats
  }

  getCatPrice(cat: IEventAreaCategory, single = false) {
    let price: any = 0

    if(this.cats.filter(i => i.id == cat.id).length > 0) {
      this.cats.map(c => {
        if(c.id == cat.id) {
          if(!single)
            price = parseInt(cat.price) * parseInt(c.quantity)
          else
            price = parseInt(cat.price)
        }
      })
    }

    return price
  }

  getCatQuantity(cat: IEventAreaCategory) {
    let quant: any = 0

    if(this.cats.filter(i => i.id == cat.id).length > 0) {
      this.cats.map(c => {
        if(c.id == cat.id) {
          quant = parseInt(c.quantity)
        }
      })
    }

    return quant
  }

  getCatAvailable(cat: IEventAreaCategory) {
    return cat.count - cat.basket
  }

  getPriceInfo(item: any) {
    let price: any = 0

    this.prices.map(pr => {
      if(pr.id == item.price_id)
        price = pr
    })
    
    let pr: IEventPrice = price
    return pr
  }

  getPlaceInfo(item: any) {
    const price = this.getPriceInfo(item)

    let place: any

    price.place.map(pl => {
      if(pl.id == item.place_id)
        place = pl
    })

    let pl: IEventAreaPlaces = place

    return pl
  }

  getTotalPrice() {
    let price: any = 0

    this.categories.map(cat => {
      price += this.getCatPrice(cat)
    })

    this.places.map(pl => {
      const p = this.getPriceInfo(pl)
      if(p && p.price)
        price += p.price
    })

    return price
  }

  getTotalCount() {
    let quant: any = 0

    this.categories.map(cat => {
      quant += this.getCatQuantity(cat)
    })

    this.places.map(pl => {
      quant++
    })

    return quant
  }

  close() {
    this.data.emit('buy')
  }

}
