import { AfterContentInit, Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CalculateOrderData } from 'src/app/exports/functions/CalculateOrderData';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

declare var $: any

@Component({
  selector: '[data-app-orders]',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class OrdersComponent implements AfterContentInit {

  user: CurrentUserType
  items: ICheckoutItem[] = []
  categories: ISelectValue[] = []
  category: any = false
  searching: string = ""

  constructor(
    private router$: Router,
    private user$: UserService,
    private bao$: BaoService
  ) { }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe(user => {
      if(user && !this.user)
        this.user = user
    })
    IsAuthorizedFunction(this.user$, this.router$)
    this.init()
  }

  init(data = {}) {
    this.bao$.getOrders(data).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.items = response.results
        this.getCategories()
        setTimeout(() => {
          CalculateOrderData()
          $(document).resize(() => {
            CalculateOrderData()
          })
        }, 500)
      }
    })
  }
  
  getCategories() {
    const categories = this.categories
    this.items.map(item => {
      let found = false
      this.categories.map(val => {
        if(item.status.id == val.value)
          found = true
      })

      if(!found) {
        categories.push({
          name: item.status.name,
          value: item.status.id
        })
      }
    })

    this.categories = categories
  }

  setCategory(val: any) {
    this.category = val
    console.log('val', val)
    // this.init({
    //   status: this.category
    // })
  }

  search(event: any) {
    this.searching = event.target.value
    console.log('search', this.searching)
    // this.init({
    //   search: this.searching,
    //   status: this.category
    // })
  }

}
