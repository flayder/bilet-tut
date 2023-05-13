import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IEventCheckerItem } from 'src/app/exports/interfaces/IEventCheckerItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

interface IData {
  user: IUserItem
  products: IBasketItem[]
}

@Component({
  selector: '[data-app-wrap-statistic-checkin]',
  templateUrl: './wrap-statistic-checkin.component.html',
  styleUrls: ['./wrap-statistic-checkin.component.css']
})
export class WrapStatisticCheckinComponent implements OnInit {

  items: IEventCheckerItem[] = []
  user: IUserItem
  init: boolean = false
  order_list: IData[] = []
  events: ISelectValue[] = []

  elements = new Subject<IEventCheckerItem[]>()

  constructor(
    private user$: UserService,
    private event$: EventService
  ) { 
    this.elements.subscribe(items => {
      this.items = items

      if(!this.init) {
        this.init = true

        this.serialize()
        this.getEvents()
      }
    })

    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
        if(!this.init) {
          if(this.user.role == 'manager') {
            this.event$.getEventCheckin({
              checkout__products__product__user: user.id
            }).subscribe((response: IHttpResponse) => {
              if(Array.isArray(response.results)) {
                this.elements.next(response.results)
              }
            })
          } else {
            this.event$.getEventCheckin()
              .subscribe((response: IHttpResponse) => {
              if(Array.isArray(response.results)) {
                this.elements.next(response.results)
              }
            })
          }
        }
      }
    })
  }

  getEvents() {
    const arr: ISelectValue[] = []
    this.items.map(item => {
      if(item.checkout && Array.isArray(item.checkout.products)) {
        item.checkout.products.map(i => {
          if(arr.filter(it => it.value == i.product.id).length == 0) {
            arr.push({
              name: i.product.name,
              value: i.product.id
            })
          }
        })
      }
    })

    this.events = arr
  }

  getEvent(event: number) {
    if(this.user.role == 'manager') {
      this.event$.getEventCheckin({
        checkout__products__product__user: this.user.id,
        checkout__products__product: event
      }).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.elements.next(response.results)
        }
      })
    } else {
      this.event$.getEventCheckin({
        checkout__products__product: event
      })
        .subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.elements.next(response.results)
        }
      })
    }
  }

  serialize() {
    const arr: IData[] = []
    console.log('this.items', this.items)
    this.items.map(item => {
      let found = false
      arr.map((i: IData, k) => {
        if(i.user.id == item.checkout.user.id) {
          found = true
          item.checkout.products.map(ch => {
            arr[k].products.push(ch)
          })
        }
      })
      if(!found && item.checkout && Array.isArray(item.checkout.products)) {
        arr.push({
          user: item.checkout.user,
          products: item.checkout.products
        })
      }
    })

    this.order_list = arr
  }

  getStatus(id: number) {
    return this.items.filter(item => item.status.id == id).length
  }

  getUserName(user: IUserItem) {
    let name = ''
    if(user.surname || user.username) {
      if(user.surname) {
        name += user.surname + ' '
      }

      if(user.username) {
        name += user.username
      }
    } else {
      if(user.legal_first_name) {
        name += user.legal_first_name + ' '
      }

      if(user.legal_name) {
        name += user.legal_name
      }
    }

    return name
  }

  ngOnInit(): void {
    
  }

}
