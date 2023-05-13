import { Component, Input, OnInit } from '@angular/core';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { IEventAreaPlaces } from 'src/app/exports/interfaces/IEventPlace';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BaoService } from 'src/app/services/bao.service';

@Component({
  selector: '[data-app-basket-item]',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.css']
})
export class BasketItemComponent implements OnInit {

  @Input() item: IBasketItem
  manager: any
  discount: boolean = false
  init: boolean = false

  constructor(
    private basket$: BaoService
  ) { 
    
  }

  getTypes() {
    return this.item.product.type.name
  }

  ngOnInit(): void {}

  getPrice() {
    let price = ''
    if(this.item.discount_price > 0) {
      price += `<p class="discount"><strong>${this.item.pricing} р.</strong></p>`
      price += `<p><strong>${this.item.discount_price} р.</strong></p>`
    } else
      price += `<p><strong>${this.item.pricing} р.</strong></p>`
    
    return price
  }

  getTotalPrice() {
    let price = ''
    const discount: IDiscountItem = this.basket$.getLocalDiscount()

    if(discount && this.item.discount_price > 0) {
      let pr = 0
      
      if(discount.point == 'percent')
        pr = this.item.discount_price * this.item.quantity
      else
        pr = this.item.pricing * this.item.quantity - (this.item.pricing - this.item.discount_price)

      price += `<p class="discount"><strong>${this.item.pricing * this.item.quantity} р.</strong></p>`
      price += `<p><strong>${pr} р.</strong></p>`
    } else 
      price += `<p><strong>${this.item.pricing * this.item.quantity} р.</strong></p>`
    
    return price
  }

  setCount(quantity: number) {
    const f_user = this.basket$.getFUserKey()

    const params: any = {
      product: this.item.product.id,
      date: this.item.date.id,
      quantity,
      f_user
    }

    if(this.item.place)
      params.place = this.item.place.id

    if(this.item.category)
      params.category = this.item.category.id

    if(this.item.price)
      params.price = this.item.price.id

    if(this.item.quantity != quantity) {
      this.basket$.addBasket(params).subscribe(res => {
        this.basket$.getCurrentBasket()
      })
    }
    
  }

  getName() {
    let name: any = ''
    if(this.item.category && this.item.category.name) {
      name += `<p><strong>${this.item.category.name}</strong></p>`
      if(this.item.category.description)
        name += `<p>${this.item.category.description}</p>`
    } else if(this.item.price && this.item.place) {
      name += `<p><strong>Место: ${this.item.place.name}, ряд: ${this.item.place.row}</strong></p>`
    }
    
    return name
  }

  removeProduct() {
    this.basket$.response.subscribe((response: IHttpResponse) => {
      if(response.results)
        this.basket$.getCurrentBasket()
    })
    this.basket$.removeProduct(this.item.id)
  }

}
