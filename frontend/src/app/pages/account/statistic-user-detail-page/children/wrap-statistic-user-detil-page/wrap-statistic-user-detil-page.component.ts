import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalculateOrderData } from 'src/app/exports/functions/CalculateOrderData';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { BaoService } from 'src/app/services/bao.service';
import { UserService } from 'src/app/services/user.service';

declare var $: any

@Component({
  selector: '[data-app-wrap-statistic-user-detil-page]',
  templateUrl: './wrap-statistic-user-detil-page.component.html',
  styleUrls: ['./wrap-statistic-user-detil-page.component.css']
})
export class WrapStatisticUserDetilPageComponent implements OnInit {

  user: IUserItem
  user_request: IUserItem
  items: ICheckoutItem[] = []
  
  constructor(
    private bao$: BaoService,
    private user$: UserService,
    private activate$: ActivatedRoute
  ) { 
    this.activate$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id') && params.id > 0) {
        this.user$.admin.getUserDetail(params.id).subscribe((response: IHttpResponse) => {
          if(typeof response.results == "object") {
            this.user_request = response.results
            this.bao$.getUserCheckoutList(params.id).subscribe((res: IHttpResponse) => {
              if(Array.isArray(res.results)) {
                this.items = res.results
                setTimeout(() => {
                  CalculateOrderData()
                  $(document).resize(() => {
                    CalculateOrderData()
                  })
                }, 500)
              }
            })
          }
          
        })
      }
    })

    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
      }
    })
  }

  ngOnInit(): void {
    
  }

}
