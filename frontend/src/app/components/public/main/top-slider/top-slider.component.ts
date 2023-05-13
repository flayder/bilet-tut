import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { SearchPageType } from 'src/app/exports/types/SearchPageType';
import { EventService } from 'src/app/services/event.service';
import { RandomStringFunction } from '../../../../exports/functions/RandomStringFunction';
import { Router } from '@angular/router';
import { ISliderItem } from 'src/app/exports/interfaces/ISliderItem';
import { DesignService } from 'src/app/services/design.service';

declare var $: any;

@Component({
  selector: 'div[data-app-top-slider]',
  templateUrl: './top-slider.component.html',
  styleUrls: ['./top-slider.component.css']
})
export class TopSliderComponent implements AfterContentInit {
  
  items: Array<ISliderItem> = []
  initiation: boolean = false

  @Input() pageType: SearchPageType
  @Input() showGenre: boolean
  @Input() isCategory: boolean = false

  $id = RandomStringFunction()

  constructor(
    private design$: DesignService,
    private router$: Router
  ) { }

  ngAfterContentInit(): void {
    this.getItems()
  }

  getItems() {
    if(this.items.length == 0) {
      //if(!this.isCategory) {
        this.design$.getSliders({
          is_banner: "false"
        }).subscribe((result: IHttpResponse) => {
          if(Array.isArray(result.results) && result.results.length > 0) {
            this.items = result.results
            setTimeout(() => {
              this.init()
            }, 700)
          }
        })
      // } else {
      //   const type = this.router$.routerState.snapshot.url.split("/")
      //   this.event$.getList({category: type[1]}).subscribe((result: IHttpResponse) => {
      //     if(Array.isArray(result.results) && result.results.length > 0) {
      //       this.items = result.results
            
      //       setTimeout(() => {
      //         this.init()
      //       }, 700)
      //     }
      //   })
      // }
    }
  }

  init() {
    const id = $(`#${this.$id}`)
    // Главный слайдер
    if (id.length > 0 && this.items.length > 0) {
      $(id).slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1000,
        fade: true,
        dots: true,
      })
      this.initiation = true
    }
  }

}
