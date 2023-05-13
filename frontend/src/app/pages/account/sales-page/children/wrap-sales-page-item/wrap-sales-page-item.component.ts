import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';

@Component({
  selector: 'tr[data-app-wrap-sales-page-item]',
  templateUrl: './wrap-sales-page-item.component.html',
  styleUrls: ['./wrap-sales-page-item.component.css']
})
export class WrapSalesPageItemComponent implements OnInit {

  @Input() item: ICheckoutItem

  constructor() { }

  ngOnInit(): void {
  }

  getProducts() {
    let name = ''
    this.item.products.map(item => {
      name += `${item.product.name} <br/>`
    })

    return name
  }

  getPrices() {
    let name = ''
    this.item.products.map(item => {
      name += `${item.pricing * item.quantity} р. <br/>`
    })

    return name
  }

  getQuantity() {
    let name = ''
    this.item.products.map(item => {
      name += `${item.quantity} <br/>`
    })

    return name
  }

  getTimes() {
    let name = ''
    this.item.products.map(item => {
      name += `${formatDate(item.date.start_date, "HH:mm", "en-EN")} <br/>`
    })

    return name
  }

  getDates() {
    let name = ''
    this.item.products.map(item => {
      name += `${formatDate(item.date.start_date, "dd.MM.YYYY", "en-EN")} <br/>`
    })

    return name
  }

  getUserInfo() {
    let name = ''
    if(this.item.user.surname || this.item.user.username) {
      name += `${this.item.user.surname} ${this.item.user.username}`
    } else if(this.item.user.legal_first_name || this.item.user.legal_name) {
      name += `${this.item.user.legal_first_name} ${this.item.user.legal_name}`
    }

    return name
  }

}
