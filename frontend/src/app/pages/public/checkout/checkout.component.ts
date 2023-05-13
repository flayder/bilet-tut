import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(
    private breadcrumbs$: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.breadcrumbs$.addItem({
      path: "/basket",
      name: "Корзина"
    }, true)
    
    this.breadcrumbs$.addItem({
      path: "checkout",
      name: "Оформление заказа"
    })
  }

}
