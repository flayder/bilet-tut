import { Component, OnInit, Input, AfterContentInit } from '@angular/core';
import { IEventItem } from '../../../../../../../exports/interfaces/IEventItem';
import { EventService } from 'src/app/services/event.service';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { STATIC_EVENTS, TAGS_LIST, TAG_REMOVE } from '../../../../../../../exports/constans';
import { IFilterValue } from '../../../../../../../exports/interfaces/IFilterValue';

type FilterType = 'genre' | 'area' | 'prices'

@Component({
  selector: '[data-app-accordion-filter-block]',
  templateUrl: './accordion-filter-block.component.html',
  styleUrls: ['./accordion-filter-block.component.css']
})
export class AccordionFilterBlockComponent implements AfterContentInit {

  @Input() items: IEventItem[] = []
  area: number[] = []
  genre: number[] = []
  prices: number[] = []
  init: boolean = false
  
  cities: IFilterValue[] = []
  genres: IFilterValue[] = []
  
  min_price: number = 0
  max_price: number = 0
  
  constructor(
    private event$: EventService
  ) { 
    STATIC_EVENTS.subscribe(items => {
      if(this.items.length == 0) {
        this.items = items
        if(!this.init) {
          this.getMinPrice()
          this.getMaxPrice()
          this.getCities()
          this.getGenres()
        }
        this.init = true
      }
    })

    TAG_REMOVE.subscribe((item: any) => {
      const key: FilterType = item.key
      const items: any = this[key]
      const k: number = items.indexOf(item.value)
      items.splice(k, 1)

      this[key] = items
    })
  }

  getMinPrice() {
    const prices: number[] = []
    this.items.map(item => {
      const price = item.price[0]
      if(price > 0) {
        prices.push(price)
      }
    })
    const result = Math.min.apply(Math, prices)
    this.min_price = (result >= 0) ? result : 0
  }

  getMaxPrice() {
    const prices: number[] = []
    this.items.map(item => {
      const price = item.price[1]
      if(price > 0) {
        prices.push(price)
      }
    })

    const result = Math.max.apply(Math, prices)
    this.max_price = (result >= 0) ? result : 0
  }

  getPrices(price: number[]) {
    this.addItem({
      name: `От ${price[0]} до ${price[1]}`,
      value: JSON.stringify(price),
      key: 'prices'
    }, 'prices')
  }

  addItem(item: IFilterValue, key: FilterType) {
    const params = TAGS_LIST.getValue()
    let found: any = false
    params.map((i, k) => {
      if(item.key == i.key && item.value == i.value) {
        found = k
      }
      if(item.key == 'prices' && item.key == i.key) {
        found = k
      }
    })

    if(found === false) {
      params.push(item)
    } else {
      if(params[found]) {
        params[found] = item
      }
    }

    TAGS_LIST.next(params)

    if(!this[key].includes(item.value)) {
      const arr: any = this[key]
      arr.push(item.value)
      this[key] = arr
    }
  }

  removeItem(item: IFilterValue, key: FilterType) {
    const params = TAGS_LIST.getValue()

    params.map((i, k) => {
      if(item.key == i.key && item.value == i.value) {
        params.splice(k, 1)
      }
    })

    TAGS_LIST.next(params)

    if(this[key].includes(item.value)) {
      let arr = this[key]
      arr = arr.filter(i => i != item.value)
      this[key] = arr
    }
  }

  ifActive(item: IFilterValue, key: FilterType) {
    return this[key].includes(item.value)
  }

  getCities() {
    const arr: IFilterValue[] = []
    if(this.items.length > 0) {
      this.items.map(item => {
        if(arr.filter(i => i.name == item.area.name).length == 0) {
          arr.push({
            name: item.area.name,
            value: item.area.id,
            key: 'area'
          })
        }
      })
    }

    this.cities = arr
  }

  getGenres() {
    const arr: IFilterValue[] = []
    if(this.items.length > 0) {
      this.items.map(item => {
        item.genre.map(i => {
          if(arr.filter(ii => ii.value == i.id).length == 0) {
            arr.push({
              name: i.name,
              value: i.id,
              key: 'genre'
            })
          }
        })
      })
    }

    this.genres = arr
  }

  getItem(event: any, item: IFilterValue, key: FilterType) {
    console.log(item, key)
    if(event.target.checked) {
      this.addItem(item, key)
      
    } else {
      this.removeItem(item, key)
      
    }
  }

  ngAfterContentInit(): void {
    
  }

}
