import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IPromotionItem } from 'src/app/exports/interfaces/IPromotionItem';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  item: IEventItem
  promotion: IPromotionItem

  constructor(
    private title$: Title,
    private router$: ActivatedRoute,
    private event$: EventService,
    private breadcrubms$: BreadcrumbService
  ) { 
    //title$.setTitle('ok')
    router$.params.subscribe(params => {
      this.event$.getDetail(params.detailId).subscribe((response: IHttpResponse) => {
        this.item = response.results

        this.event$.promotions.subscribe(promotions => {
          if(promotions.length > 0) {
            this.promotion = promotions[0]
          }
        })

        this.event$.getPromotions({event: this.item.id})
        breadcrubms$.addItem({
          path: `event/${this.item.id}`,
          name: this.item.name
        }, true)
      })
    })
  }

  ngOnInit(): void {
    
  }

  getPromotionName() {
    if(this.promotion) {
      if(this.promotion.type == "TEMPLATE") {
        if(this.promotion.template == "TWONE")
          return "2 + 1"
        else 
          return "3 + 1"
      }
    }

    return ""
  }

  getPromotionDescription() {
    if(this.promotion) {
      if(this.promotion.type == "TEMPLATE") {
        return this.promotion.template_descr
      } else if(this.promotion.type == "DYNAMIC" && this.promotion.dynamic_sum && this.promotion.dynamic_count > 0) {
        return `При покупке от ${this.promotion.dynamic_count} билетов - скидка ${this.promotion.dynamic_sum} ${this.promotion.dynamic_sum.indexOf("%") != -1 ? 'р.' : ''}`
      } else if(this.promotion.type == "FIX" && this.promotion.fix_sum && this.promotion.dynamic_count > 0) {
        return `При покупке от ${this.promotion.dynamic_count} билетов - скидка ${this.promotion.fix_sum} ${this.promotion.fix_sum.indexOf("%") != -1 ? 'р.' : ''}`
      }
    }

    return ''
  }

  getGallery() {
    var gall: any = []

    if(this.item.stage_image.length > 0)
      gall = gall.concat(this.item.stage_image)
    
    gall = gall.concat(this.item.area.gallery)

    return gall
  }

  getLatitude() {
    if(Array.isArray(this.item.area.location.coordinates)) {
      return parseFloat(this.item.area.location.coordinates[1])
    }
    return 0
  }

  getLongtitude() {
    if(Array.isArray(this.item.area.location.coordinates)) {
      return parseFloat(this.item.area.location.coordinates[0])
    }
    return 0
  }

  isDateSame() {
    return formatDate(this.item.start_date, "dd.MM.yyyy", "en-US") == formatDate(this.item.finish_date, "dd.MM.yyyy", "en-US")
  }

  setHtml() {
    const html: any = this.item.description
    return html.replace(/\r?\n/g, '<br />')
  }

}
