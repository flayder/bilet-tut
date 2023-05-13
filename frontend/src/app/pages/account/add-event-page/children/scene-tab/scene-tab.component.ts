import { Component, OnInit } from '@angular/core';
import { EVENT_DATA, EVENT_SUBJECT } from 'src/app/exports/constans';
import { EVENT_IMAGES } from '../wrap-tab/wrap-tab.component';
import { GetEventLocalStorageData } from 'src/app/exports/functions/GetEventLocalStorageData';

@Component({
  selector: '[data-app-scene-tab]',
  templateUrl: './scene-tab.component.html',
  styleUrls: ['./scene-tab.component.css']
})
export class SceneTabComponent implements OnInit {

  preview: any = false
  init = false

  constructor() { 

    EVENT_DATA.subscribe((items: any) => {
      if(items.stage_image && Array.isArray(items.stage_image) && items.stage_image.length > 0) {
        const images = EVENT_IMAGES.getValue()
        images.stage_image = items.stage_image
        this.preview = items.stage_image
        EVENT_IMAGES.next(items)
      }
    })

    EVENT_SUBJECT.subscribe((items:any) => {
      if(this.init) {
        if(!this.preview && items.image_stage) {
          this.preview = items.image_stage
        }
      }
    })
  }

  ngOnInit(): void {
    this.init = true
  }

  previewImage(value: any) {
    if(value.length > 0) {
      this.preview = value
      const images = EVENT_IMAGES.getValue()
      images.stage_image = value
      EVENT_IMAGES.next(images)
    }
      
  }

  previewDelete(value: any) {
    value.deleted = true
    const preview = this.preview
    const items: any = preview.filter((i: any) => i.id != value.id)
    const images = EVENT_IMAGES.getValue()
    images.stage_image = items
    EVENT_IMAGES.next(images)
    this.preview = items
  }

  save() {
    const fieldsDefault: any = GetEventLocalStorageData()
    EVENT_SUBJECT.next(fieldsDefault)
  }

  getPreview() {
    const preview = this.preview
    if(Array.isArray(preview))
      return preview.filter(i => !i.hasOwnProperty('deleted'))

    return []
  }
}
