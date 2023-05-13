import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  constructor(
    private breadcrumbs$: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.breadcrumbs$.addItem({
      path: "basket",
      name: "Корзина"
    }, true)
  }

}
