import { Component, OnInit, AfterContentInit } from '@angular/core';
import { IEventItem } from '../../../exports/interfaces/IEventItem';
import { EventService } from '../../../services/event.service';
import { IsAuthorizedFunction } from '../../../exports/functions/IsAuthorizedFunction';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { IUserItem } from '../../../exports/interfaces/IUserItem';
import { STATIC_EVENTS, STATIC_EVENT_PARAMS, STATIC_EVENT_RESPONSE, TAGS_LIST } from '../../../exports/constans';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IFilterValue } from '../../../exports/interfaces/IFilterValue';

@Component({
  selector: 'app-statistic-page',
  templateUrl: './statistic-page.component.html',
  styleUrls: ['./statistic-page.component.css']
})
export class StatisticPageComponent implements AfterContentInit {

  //items: IEventItem[] = []
  user: IUserItem
  init: boolean = false

  constructor(
    private user$: UserService,
    private router$: Router,
    private event$: EventService
  ) { 
    // this.event$.events.subscribe(items => {
    //   this.items = items
    // })

    TAGS_LIST.subscribe(params => {
      if(this.user) {
        const params$: any = this.configurateParams(params)
        
        if(this.user.role != 'admin')
          params$.user = this.user.id

        if(params$.hasOwnProperty('page')) {
          delete params$['page']
        }
        STATIC_EVENT_PARAMS.next(params$)
        this.event$.getList(params$).subscribe(response => {
          STATIC_EVENT_RESPONSE.next(response)
          if(response.results && Array.isArray(response.results))
            STATIC_EVENTS.next(response.results)
        })
      }
    })
  }

  configurateParams(params: IFilterValue[]) {
    const filter: any = {}
    params.map((i, key) => {
      const item: any = i
      if(filter.hasOwnProperty(item.key)) {
        filter[item.key] = `${filter[item.key]},${item.value}`
      } else {
        filter[item.key] = item.value
      }
    })

    return filter
  }

  ngAfterContentInit(): void {
    this.init = true
    IsAuthorizedFunction(this.user$, this.router$).subscribe((user: any) => {
      if(user && user.hasOwnProperty('role') && user.role == 'viewer') {
        this.router$.navigateByUrl("account")
      }
      if(user) {
        this.user = user
        if(this.init) {
          let params: any = {}

          if(this.user.role == 'manager')
            params = {user: user.id}

          if(this.user.role == 'admin')
            params.is_admin = 1

          this.event$.getList(params).subscribe(response => {
            STATIC_EVENT_RESPONSE.next(response)
            STATIC_EVENT_PARAMS.next(params)
            if(response.results && Array.isArray(response.results))
              STATIC_EVENTS.next(response.results)
          })
          this.init = false
        }
      } 
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }

}
