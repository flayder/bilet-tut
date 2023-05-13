import { Component, OnInit } from '@angular/core';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BaoService } from 'src/app/services/bao.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-withdrawal-page]',
  templateUrl: './wrap-withdrawal-page.component.html',
  styleUrls: ['./wrap-withdrawal-page.component.css']
})
export class WrapWithdrawalPageComponent implements OnInit {

  items: IEventItem[] = []
  checkouts: ICheckoutItem[] = []

  constructor(
    private user$: UserService,
    private event$: EventService,
    private bao$: BaoService
  ) { 
    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.event$.getList({
          user: user.id
        })
        .subscribe(responseItems => {
          this.bao$.getUserCheckoutList(user.id)
            .subscribe((response: IHttpResponse) => {
              if(Array.isArray(responseItems.results)) {
                this.items = responseItems.results
              }

              if(Array.isArray(response.results)) {
                this.checkouts = response.results
              }
            })
        })
      }
    })
  }

  getCheckouts(event: number) {
    return this.checkouts.filter(item => item.products.filter(i => i.id == event).length > 0)
  }

  ngOnInit(): void {
  }

}
