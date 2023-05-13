import { Component, OnInit } from '@angular/core';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { IPromotionItem } from 'src/app/exports/interfaces/IPromotionItem';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: '[data-app-wrap-promocode-page]',
  templateUrl: './wrap-promocode-page.component.html',
  styleUrls: ['./wrap-promocode-page.component.css']
})
export class WrapPromocodePageComponent implements OnInit {

  items: IPromotionItem[] = []

  constructor(
    private event$: EventService,
  ) { 
    this.event$.promotions.subscribe(items => {
      this.items = items
    })
  }

  ngOnInit(): void {
    this.event$.getPromotions()
  }

}
