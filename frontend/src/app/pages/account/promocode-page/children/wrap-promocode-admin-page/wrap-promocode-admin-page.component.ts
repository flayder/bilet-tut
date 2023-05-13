import { Component, OnInit } from '@angular/core';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: '[data-app-wrap-promocode-admin-page]',
  templateUrl: './wrap-promocode-admin-page.component.html',
  styleUrls: ['./wrap-promocode-admin-page.component.css']
})
export class WrapPromocodeAdminPageComponent implements OnInit {

  items: IDiscountItem[] = []

  constructor(
    private bao$: BaoService,
    private message$: MessageService
  ) { 
    this.bao$.discounts.subscribe(items => {
      this.items = items
    })
  }

  ngOnInit(): void {
    this.bao$.getDiscounts()
  }

}
