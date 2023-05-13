import { Component, OnInit, Input } from '@angular/core';
import { IEventItem } from '../../../../../exports/interfaces/IEventItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { STATIC_EVENTS, STATIC_EVENT_PARAMS, STATIC_EVENT_RESPONSE, TAGS_LIST } from 'src/app/exports/constans';
import { UserService } from 'src/app/services/user.service';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';

@Component({
  selector: '[data-app-wrap-filter-product]',
  templateUrl: './wrap-filter-product.component.html',
  styleUrls: ['./wrap-filter-product.component.css']
})
export class WrapFilterProductComponent implements OnInit {

  items: IEventItem[] = []
  user: IUserItem

  response = STATIC_EVENT_RESPONSE
  params = STATIC_EVENT_PARAMS
  elements = STATIC_EVENTS

  ordering: ISelectValue[] = [
    {
      name: "По дате начала мероприятия",
      value: "dates__start_date"
    },
    {
      name: "По названию",
      value: "name"
    }
  ]
  
  constructor(
    private user$: UserService
  ) { 
    
    this.user$.user.subscribe(user => {
      if(user && typeof user == "object") {
        this.user = user
      }
    })
    
    STATIC_EVENTS.subscribe(items => {
      if(Array.isArray(items))
        this.items = items
    })
  }

  getOrder(value: ISelectValue) {
    let params = TAGS_LIST.getValue()

    let item: any = false
    this.ordering.map(i => {
      if(i.value == value)
        item = i
    })
    
    if(item) {
      let found: any = false
      params.map((i, k) => {
        if(i.key == 'ordering') {
          found = k
        }
      })

      if(found === false) {
        params.push({
          name: item.name,
          value: item.value,
          key: 'ordering'
        })
      } else {
        if(params[found]) {
          params[found] = {
            name: item.name,
            value: item.value,
            key: 'ordering'
          }
        }
      }
    } else {
      params = params.filter(i => i.key != 'ordering')
    }

    TAGS_LIST.next(params)
  }

  ngOnInit(): void {
    
  }

}
