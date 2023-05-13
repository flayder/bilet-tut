import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { EVENT_CITY, EVENT_DATA, EVENT_SUBJECT, TIME_LIST } from 'src/app/exports/constans';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { SetEventLocalStorageData } from 'src/app/exports/functions/SetEventLocalStorageData';
import { IDateItem } from 'src/app/exports/interfaces/IDateItem';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-date-tab]',
  templateUrl: './date-tab.component.html',
  styleUrls: ['./date-tab.component.css']
})
export class DateTabComponent implements OnInit {
  init: boolean = false
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  times: ISelectValue[] = TIME_LIST
  template = {start_date: '', finish_date: ''}
  dates: IDateItem[] = [this.template]
  readonly cloneDate: IDateItem[] = []
  user: IUserItem
  event: any = false
  areas: ISelectValue[] = []
  area_id: number = 0
  city: any = false

  form = new FormGroup({
    city: new FormControl<number>(0, [
      Validators.required
    ]),
    area: new FormControl<number>(0, [
      Validators.required
    ]),
  })

  getAreas(city: number) {
    if(this.city != city) {
      this.event$.getArea({city}).subscribe((response: IHttpResponse) => {
        
        this.city = city
        
        if(Array.isArray(response.results)) {
          const arr: ISelectValue[] = []
          response.results.map((item: IEventArea) => {
            arr.push({
              name: item.name,
              value: item.id
            })
          })

          this.areas = arr
          //console.log('this.area_id', this.area_id)
          if(this.area_id > 0) {
            setTimeout(() => {
              this.defaultValue.next({
                area: this.area_id
              })
            }, 200)
          }
        }
      })
    }
  }

  getDate(event: any) {
    const dates: IDateItem[] = this.dates
    dates[event.key] = event.item
    if(dates.length != this.dates.length) {
      this.dates = dates
    }
  }

  setDate(item: any) {
    return item
  }

  constructor(
    private event$: EventService,
    private message$: MessageService,
    private user$: UserService,
    private param$: ActivatedRoute
  ) { 
    this.param$.params.subscribe(params => {
      if(typeof params == "object" && params.event_id) {
        this.event = params.event_id
      }
    })

    EVENT_DATA.subscribe((items: any) => {

      if(typeof items == "object" && typeof items.city == "object") {
        this.event = items
        this.getAreas(items.city.id)
        setTimeout(() => {
          this.defaultValue.next({
            city: items.city.name,
            area: items.area.id
          })
        }, 100)
        this.area_id = items.area.id
        this.form.controls.city.setValue(items.city.id)
        //this.form.controls.area.setValue(items.area.id)
        
      }
      
    })

    EVENT_SUBJECT.subscribe((items:any) => {
      if(this.init) {
        this.formSubmit.next({})
        for(let field in items) {
          const con = this.form.get(field)
          if(con && items[field] != con.getRawValue()) {
            con.setValue(items[field])
          }
        }
      }
    })

    for(let field in this.form.value) {
      const control = this.form.get(field)
      if(control) {
        control.valueChanges.subscribe(value => {
          //console.log('city', value)
          if(value > 0) {
            const obj: any = {}
            obj[field] = value
            SetEventLocalStorageData(obj)
          }
          
        })
      }
    }

    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
      }
    })
  }

  addDate() {
    this.dates.push(this.template)
  }

  getCity(city: any) {
    if(city > 0) {
      this.getAreas(city)
      //console.log('genre', genre)
      //EVENT_CITY.next(genre)
    }
  }

  returnZero() {
    return 0
  }

  ngOnInit(): void {
    this.init = true

    this.getDates()
  }

  deleteDate(item: IDateItem, key: any) {
    if(item.id) {
      this.event$.admin.deleteDate(item.id).subscribe(res => {
        this.dates.splice(key, 1)
        this.message$.handle("Дата была успешно удалена", "success")
      })
    } else {
      this.dates.splice(key, 1)
    }
  }

  getEventId() {
    if(this.event > 0) {
      return this.event
    } 
    if(
      typeof this.event == "object" && 
      this.event.hasOwnProperty('id') && 
      this.event.id > 0
    )
      return this.event.id

    return false
  }

  getDates() {
    const params: any = {}

    if(this.getEventId()) {
      params.event__pk = this.getEventId()
    }
    
    this.event$.getDates(params).subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results) && response.results.length > 0) {
        const dates: IDateItem[] = []
        this.cloneDate.map((i, k) => {
          this.cloneDate.splice(k, 1)
        })
        //console.log('this.event', this.event)
        response.results.map((item: IDateItem) => {
          if(!this.event && !Array.isArray(item.event) || 
            !this.event && Array.isArray(item.event) 
              && item.event.length == 0
          ) {
            dates.push(item)
            this.cloneDate.push(item)
          } else if(this.getEventId() > 0 && Array.isArray(item.event) && item.event.length > 0) {
            dates.push(item)
            this.cloneDate.push(item)
          }
        })

        this.dates = dates
      }
    })
  }

  getArea(area: number) {
    //console.log('area', area)
    EVENT_CITY.next(area)
  }

  isPayment() {
    const value = new Subject

    return value
  }

  isUpdated(date: IDateItem) {
    if(this.cloneDate.filter(i => i.id == date.id && i.start_date != date.start_date || i.id == date.id && i.finish_date != date.finish_date).length > 0)
      return true

    return false
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})

    if(this.init) {
      this.init = false
      let add = 0
      let update = 0

      this.dates.map((date, key) => {
        if(this.getEventId()) {
          date.event = this.getEventId()
        }
        //console.log('date', date)

        if(!date.hasOwnProperty('id')) {
          this.event$.admin.addDate(date).subscribe(res => {
            if(add == 0) {
              this.message$.handle('Даты успешно добавлены', 'success')
              this.initiation(500)
            }
            add++
          })
        } else if (date.id && this.isUpdated(date)){
          const params = {start_date: date.start_date, finish_date: date.finish_date}

          this.event$.admin.updateDate(date.id, params).subscribe(res => {
            if(update == 0) {
              this.message$.handle('Даты успешно обновлены', 'success')
              this.initiation(500)
            }
            update++
          })
        }
      })

      if(typeof this.event == "object") {
        this.defaultValue.next({city: this.event.city.name})
        this.form.controls.city.setValue(this.event.city.id)
      }

      setTimeout(() => {
        if(add > 0) {
          this.getDates()
        }
      }, 1000);

      this.initiation(1500)
    }
  }

  initiation(sec: number) {
    if(!this.init) setTimeout(() => {this.init = true}, sec)
  }

}