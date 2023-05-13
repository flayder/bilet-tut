import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-statistic-user]',
  templateUrl: './wrap-statistic-user.component.html',
  styleUrls: ['./wrap-statistic-user.component.css']
})
export class WrapStatisticUserComponent implements OnInit {

  orders = new Subject<IBasketItem[]>()
  init: boolean = false
  users: IUserItem[] = []
  items: IBasketItem[] = []
  user: IUserItem
  order_list: ISelectValue[] = []
  name: any = ''
  event: any = ''

  constructor(
    private bao$: BaoService,
    private user$: UserService
  ) { 
    this.orders.subscribe(items => {
      if(Array.isArray(items)) {
        this.items = items
        //console.log('this.itemsthis.items', this.items)
        const arr: ISelectValue[] = []
        if(!this.init) {
          this.init = true

          this.items.map(item => {
            let found = false
  
            this.order_list.map(i => {
              if(item.product.id == i.value) {
                found = true
              }
            })
  
            if(!found) {
              arr.push({
                name: `${item.product.name} - ${item.product.user.email}`,
                value: item.product.id
              })
            }
          })
  
          this.order_list = arr
        }
      }
    })

    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
        
        this.getRequest()
      }
    })
  }

  getRequest(data = {}) {
    if(this.user.role != 'admin') {
      this.bao$.getUserCheckouts(this.user.id, data).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.orders.next(response.results)
        }
      })
    } else {
      this.user$.admin.getUser(data).subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results)) {
          this.users = response.results
        }
      })
    }

    
  }

  getName(name: any) {
    this.name = name.target.value
    this.getRequest({
      event: this.event,
      search: this.name
    })
  }

  getEvent(value: number) {
    this.event = value > 0 ? value : ''
    this.getRequest({
      event: this.event,
      search: this.name
    })
  }

  ngOnInit(): void {
    
  }

}
