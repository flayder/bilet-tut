import { Component, OnInit } from '@angular/core';
import { ICheckoutReturn } from 'src/app/exports/interfaces/ICheckoutReturn';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-return-list-page]',
  templateUrl: './wrap-return-list-page.component.html',
  styleUrls: ['./wrap-return-list-page.component.css']
})
export class WrapReturnListPageComponent implements OnInit {

  items: ICheckoutReturn[] = []
  user: CurrentUserType = false
  products: ISelectValue[] = []

  constructor(
    private bao$: BaoService,
    private user$: UserService
  ) {
    this.bao$.returns.subscribe(items => {
      this.items = items
      if(this.products.length == 0) {
        const arr: ISelectValue[] = []
        this.items.map(item => {
          item.checkout.products.map(basket => {
            arr.push({
              name: `Заказ №${item.checkout.id}, запрос на возврат №${item.id}, ${basket.product.name}`,
              value: item.checkout.id
            })
          })
        })

        this.products = arr
      }
    })

    this.user$.user.subscribe((user: any) => {
      if(user && typeof user == 'object' && 'id' in user) {
        this.user = user
        this.bao$.getCheckoutReturns({orginiser: user.id})
      }
    })
  }

  ngOnInit(): void {
  }

  getCheckout(checkout: any) {
    if(typeof this.user == "object" && this.user.hasOwnProperty('id')) {
      this.bao$.getCheckoutReturns({
        user: this.user.id,
        checkout
      })
    }
  }

  getCheckoutID() {
    if(this.user) {
      if(
        typeof this.user == "object" &&
        this.user.hasOwnProperty('id')
      ) {
        return this.user.id
      }
    }
    return null
  }

  getTotalPrice() {
    let price = 0

    this.items.map(item => {
      if(item.checkout.total_price > 0)
        price += item.checkout.total_price
    })

    return price
  }

}
