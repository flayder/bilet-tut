import { Component, OnInit } from '@angular/core';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-sales-page]',
  templateUrl: './wrap-sales-page.component.html',
  styleUrls: ['./wrap-sales-page.component.css']
})
export class WrapSalesPageComponent implements OnInit {

  items: ICheckoutItem[] = []

  constructor(
    private bao$: BaoService,
    private user$: UserService
  ) { 
    this.user$.user.subscribe(user => {
      if(typeof user == "object" && user.hasOwnProperty('id')) {
        this.bao$.getOrders({orginiser: user.id}).subscribe((response: IHttpResponse) => {
          if(Array.isArray(response.results)) {
            this.items = response.results
          }
        })
      }
    })
  }

  ngOnInit(): void {
    
  }

}
