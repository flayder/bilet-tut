import { Component, Input, OnInit } from '@angular/core';
import { ICheckoutReturn } from 'src/app/exports/interfaces/ICheckoutReturn';

@Component({
  selector: '[data-app-params-return-page-item]',
  templateUrl: './params-return-page-item.component.html',
  styleUrls: ['./params-return-page-item.component.css']
})
export class ParamsReturnPageItemComponent implements OnInit {

  @Input() item: ICheckoutReturn

  constructor() { }

  ngOnInit(): void {
  }

  getNames() {
    let name = ''
    this.item.checkout.products.map(basket => {
      name += ' ' + basket.product.name + '<br/>'
    })

    return name
  }

}
