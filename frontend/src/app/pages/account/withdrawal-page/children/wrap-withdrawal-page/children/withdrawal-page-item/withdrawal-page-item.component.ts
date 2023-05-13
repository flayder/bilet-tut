import { Component, Input, OnInit } from '@angular/core';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';

@Component({
  selector: 'tr[data-app-withdrawal-page-item]',
  templateUrl: './withdrawal-page-item.component.html',
  styleUrls: ['./withdrawal-page-item.component.css']
})
export class WithdrawalPageItemComponent implements OnInit {

  @Input() item: IEventItem
  @Input() checkouts: ICheckoutItem[] = []

  constructor() { }

  ngOnInit(): void {
  }

  getPrice() {
    let price = 0
    this.checkouts.map(i => {
      price += i.price
    })

    return price
  }

}
