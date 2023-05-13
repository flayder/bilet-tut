import { Component, OnInit } from '@angular/core';
import { EVENT_DATA, EVENT_SUBJECT } from 'src/app/exports/constans';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { EVENT_IMAGES } from '../wrap-tab/wrap-tab.component';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';

@Component({
  selector: '[data-app-afisha-tab]',
  templateUrl: './afisha-tab.component.html',
  styleUrls: ['./afisha-tab.component.css']
})
export class AfishaTabComponent implements OnInit {

  user: IUserItem
  afisha: any = false
  preview: any = false

  private init: boolean = false

  constructor() { 
    EVENT_DATA.subscribe((items: any) => {
      if(typeof items == "object") {
        if(items.afisha.id) {
          const images: any = EVENT_IMAGES.getValue()
          this.afisha = items.afisha
          images.afisha = items.afisha
        }

        if(items.preview.id) {
          const images: any = EVENT_IMAGES.getValue()
          this.preview = items.preview
          images.preview = items.preview
        }
      }
    })

    EVENT_SUBJECT.subscribe((items:any) => {
      if(this.init) {
        if(!this.afisha && items.afisha) {
          this.afisha = items.afisha
        }
  
        if(!this.preview && items.preview) {
          this.preview = items.preview
        }
      }
    })

    //console.log('router$', router$)
  }

  ngOnInit(): void {
    this.init = true
  }

  afishaImage(value: any) {
    if(value instanceof File) {
      const images = EVENT_IMAGES.getValue()
      this.afisha = value
      images.afisha = value
      EVENT_IMAGES.next(images)
    }
  }

  afishaDelete(value: any) {
    console.log('afishaDelete', value)
  }

  previewImage(value: any) {
    if(value instanceof File) {
      this.preview = value
      const images = EVENT_IMAGES.getValue()
      images.preview = value
      EVENT_IMAGES.next(images)
    }
      
  }

  save() {
    const fieldsDefault: any = GetEventLocalStorageData()
    EVENT_SUBJECT.next(fieldsDefault)
  }

  previewDelete(value: any) {
    console.log('previewDelete', value)
  }

  getAfisha() {
    if(this.afisha)
      return [this.afisha]

    return []
  }

  getPreview() {
    if(this.preview)
      return [this.preview]

    return []
  }

}
