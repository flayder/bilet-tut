import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IEventPrice } from '../exports/interfaces/IEventPrice';

declare var $: any

@Injectable({
  providedIn: 'root'
})
export class ScriptBuyService {

  $id: string
  getting = new Subject
  prices: number[] = []

  constructor() { }

  setId(id: string) {
    this.$id = id
  }

  clicking() {
    //$(document).unbind('click.Scheme')

    $(document).on('click', `#${this.$id} .operating:not(.busy)`, (el:any) => {
      const $this = $(el.target)
      const place_id = parseInt($this.attr('data-place-id'))
      const price_id = parseInt($this.attr('data-price-id'))
      
      if(place_id > 0 && price_id > 0)
        this.classing(place_id, price_id, $this)
      
    })
  }

  classing(place_id: number, price_id: number, $this: any) {
    if(!this.prices.includes(place_id)) {
      $this.addClass('pre-busy')
      this.prices.push(place_id)
      this.getting.next({place_id, price_id, action: 'add'})
    } else {
      $this.removeClass('pre-busy')
      this.prices.splice(this.prices.indexOf(place_id), 1)
      this.getting.next({place_id, price_id, action: 'remove'})
    }
  }

  setPrice(data: IEventPrice[], scheme_id: number) {
    data.map((element: IEventPrice) => {
      element.place.map(place => {
        if(place.scheme.filter(i => i == scheme_id).length > 0) {
          const item = $(`#${this.$id} [data-place-id="${place.id}"]`)
          if(item.length > 0) {
            const id = parseInt(item.attr('data-place-id'))
            if(!element.basket) {
              item.attr('data-price-id', element.id)
              if(!this.prices.includes(id)) {
                item.css('fill', element.color)
                item.removeClass('pre-busy')
              } else {
                item.css('fill', '')
                item.addClass('pre-busy')
              }
            } else {
              item.addClass('busy')
            }
          }
        }
      })
      
    })
  }
}
