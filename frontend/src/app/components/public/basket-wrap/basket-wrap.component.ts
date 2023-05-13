import { Component, OnInit } from '@angular/core';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'div[data-app-basket-wrap]',
  templateUrl: './basket-wrap.component.html',
  styleUrls: ['./basket-wrap.component.css']
})
export class BasketWrapComponent implements OnInit {

  items: Array<IBasketItem> = []

  constructor(
    private basket$: BaoService,
    private user$: UserService
  ) { 
    this.basket$.items.subscribe((items: IBasketItem[]) => {
      this.items = items
    })

    this.user$.user.subscribe(res => {
      this.basket$.getCurrentBasket()
    })
  }

  ngOnInit(): void {}

}
