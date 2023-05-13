import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { EVENT_DATA, EVENT_FIELDS, EVENT_SUBJECT } from 'src/app/exports/constans';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';
import { SetEventLocalStorageData } from 'src/app/exports/functions/SetEventLocalStorageData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

const image_data: any = {}
export const EVENT_IMAGES = new BehaviorSubject(image_data)

@Component({
  selector: '[data-app-wrap-tab]',
  templateUrl: './wrap-tab.component.html',
  styleUrls: ['./wrap-tab.component.css']
})
export class WrapTabComponent implements OnInit {

  tab: string = 'main'
  init: boolean = false
  id: number = 0
  time: any
  user: IUserItem
  updated: boolean = false

  constructor(
    private router$: Router,
    private event$: EventService,
    private message$: MessageService,
    private param$: ActivatedRoute,
    private user$: UserService,
    private modal$: ModalService
  ) { 
    //const items: any = GetEventLocalStorageData()
    //EVENT_SUBJECT.subscribe(items)
    SetEventLocalStorageData({id: 0})
    this.user$.user.subscribe(user => {
      if(
        typeof user == "object"
      ) {
        this.user = user
      }
    })

    this.event$.getErrors().subscribe(res => {
      if(!this.init) {
        setTimeout(() => {
          this.init = true
        }, 200);
      }
    })
    
    this.param$.params.subscribe(par => {
      if(
        typeof par == "object" && 
        par.hasOwnProperty('event_id') &&
        par.event_id > 0
      ) {
        this.event$.getDetail(par.event_id).subscribe((response: IHttpResponse) => {
          if(response.results) {
            const params: any = response.results
            this.id = par.event_id
            setTimeout(() => {
              EVENT_DATA.next(params)
              if(this.user.role == 'viewer' && params.user.id != this.user) {
                this.message$.handle('В доступе отказано')
                window.location.href = '/account/static'
              }
              SetEventLocalStorageData({id: parseInt(par.event_id)})
            }, 500)
          }
        })
      } else {
        SetEventLocalStorageData(EVENT_FIELDS, true)
      }
    })
    
    EVENT_SUBJECT.subscribe((it:any) => {
      const items: any = GetEventLocalStorageData()

      if(this.init && !this.id || this.init && items.id == this.id) {  
        this.init = false
        if(typeof items.area == "object") {
          if(items.area.id) {
            items.area = items.area.id
          }
        }
    
        // if(typeof items.genre == "object") {
        //   if(items.genre.id) {
        //     items.genre = items.genre.id
        //   }
        // }
    
        if(typeof items.city == "object") {
          if(items.city.id) {
            items.city = items.city.id
          }
        }
    
        const images = EVENT_IMAGES.getValue()
    
        for(let image in images) {
          if(image == 'preview' || image == 'afisha' || image == 'stage_image') {
            items[image] = images[image]
          }
        }

        if(!this.validation(items)) {
          clearTimeout(this.time)
          this.time = setTimeout(() => {
            this.saving(items)
          }, 200)
        } else
          setTimeout(() => {
            this.init = true
          }, 200)
        
      }
    })
  }

  saving(items: any) {
    if(!this.init) {
      console.log('items finish', items)

      const form = ConfigurateFormData(items)
      if(this.id > 0) {
        //дополнительный предохранитель от повторной отправки формы при обновлении
        if(!this.updated) {
          console.log('updated')
          this.updated = true
          this.event$.update(this.id, form).subscribe((response: IHttpResponse) => {
            SetEventLocalStorageData(EVENT_FIELDS, true)
            //this.message$.handle('Мероприятие было успешно обновлено', 'success')
            this.router$.navigateByUrl(`/account/statistic`)
            setTimeout(() => {
              this.init = true
            }, 200);
  
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Мероприятие было успешно обновлено'
            })
          })
        }
      } else {
        this.event$.create(form).subscribe((response: IHttpResponse) => {
          if(response.results > 0) {
            //this.message$.handle('Мероприятие было успешно создано', 'success')

            SetEventLocalStorageData(EVENT_FIELDS, true)
            this.init = true

            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Мероприятие было успешно создано'
            })

            window.location.href = `/account/event/${response.results}`

          }
        })
      }
    }
  }

  validation(data: any) {
    let err = false

    for(let item in data) {
      switch(item) {
        case 'name':
          if(!data[item] || data[item].length && data[item].length == 0) {
            err = true
            this.message$.handle('Название мероприятия обязательное для заполнения')
          }
          if(data[item] && data[item].length && data[item].length <= 3) {
            err = true
            this.message$.handle('Название мероприятия содержит слишком мало символов')
          }
          break

        case 'status':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Вы не выбрали статус')
          }
          break

        case 'area':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Вы не выбрали площадку')
          }
          break

        case 'type':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Вы не выбрали тип мероприятия')
          }
          break
        
        case 'genre':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Вы не выбрали жанр')
          }
          break

        case 'age':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Вы не выбрали возрастное ограничение')
          }
          break

        case 'description':
          if(!data[item] || data[item].length && data[item].length == 0) {
            err = true
            this.message$.handle('Вы не ввели описание')
          }

          break

        case 'payment':
          if(!data[item]) {
            err = true
            this.message$.handle('Вы не выбрали способ оплаты')
          }
  
          break

        case 'afisha':
          if(!data[item]) {
            err = true
            this.message$.handle('Фото афиши не задано')
          }
    
          break

        case 'preview':
          if(!data[item]) {
            err = true
            this.message$.handle('Фото анонса не задано')
          }
      
          break

        case 'city':
          if(!data[item] || data[item] <= 0) {
            err = true
            this.message$.handle('Город не был выбран')
          }
      
          break
        
      }
    }

    return err
  }

  ngOnInit(): void {
    this.init = true
  }

  setTab(tab: string) {
    this.tab = tab
  }

}
