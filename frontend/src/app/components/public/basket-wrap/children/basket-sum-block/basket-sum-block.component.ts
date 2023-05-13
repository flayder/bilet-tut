import { Component, Input, OnInit } from '@angular/core';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { BaoService } from 'src/app/services/bao.service';

@Component({
  selector: '[data-app-basket-sum-block]',
  templateUrl: './basket-sum-block.component.html',
  styleUrls: ['./basket-sum-block.component.css']
})
export class BasketSumBlockComponent implements OnInit {

  @Input() items: IBasketItem[] = []
  @Input() is_basket: boolean = true

  constructor(
    private basket$: BaoService
  ) { }

  ngOnInit(): void {
  }

  getDiscount() {
    let price = 0
    const discount: IDiscountItem = this.basket$.getLocalDiscount()
    if(discount) {
      this.items.map((item: IBasketItem) => {
        if(item.discount_price > 0) {
          let pricing = item.pricing - item.discount_price
          
          if(discount.point == 'percent')
            pricing = pricing * item.quantity

          if(pricing > 0)
            price += pricing
        }
      })
    }
    return price
  }

  getRealPrice() {
    let price = 0
    this.items.map((item: IBasketItem) => {
      price += (item.pricing * item.quantity)
    })
    return price
  }

  getRealDiscount() {
    const discount = this.getDiscount()
    const price = this.getRealPrice()
    if(discount && discount > 0 && price - discount > 0)
      return price - discount

    return 0
  }

  getPrice() {
    let price = ''
    const discount = this.getDiscount()
    if(discount && discount > 0) {
      price += `<p class="discount"><strong>${this.getRealPrice()} р.</strong></p>`
      price += `<p><strong>${this.getRealPrice() - discount} р.</strong></p>`
    } else
      price += `<p><strong>${this.getRealPrice()} р.</strong></p>`
    
    
    return price
  }

  getTax() {
    const tax: any = {}

    this.items.map(item => {
      const t = item.product.tax

      if(t > 0) {
        if(!tax.hasOwnProperty(item.product.id))
          tax[item.product.id] = t
      }
      
    })

    let taxes = 0
    for(let t in tax) {
      if(tax[t] > 0)
        taxes += tax[t]
    }

    return taxes
  }

  getTaxRub() {
    const price: number = this.getRealPrice()
    const tax: number = this.getTax()
    if(tax > 0)
      return Math.round((price * tax) / 100)

    return 0
  }

  getRealPriceWithTax() {
    return this.getRealPrice() + this.getTaxRub()
  }

  getLength() {
    let len = 0
    this.items.map((item: IBasketItem) => {
      len += item.quantity
    })
    return len
  }

  getTotal() {
    return this.getRealPriceWithTax() - this.getDiscount()
  }

}
