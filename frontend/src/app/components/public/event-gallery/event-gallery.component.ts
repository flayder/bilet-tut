import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IImageItem } from 'src/app/exports/interfaces/IImageItem';

declare var $: any

@Component({
  selector: 'div[data-app-event-gallery]',
  templateUrl: './event-gallery.component.html',
  styleUrls: ['./event-gallery.component.css']
})
export class EventGalleryComponent implements AfterViewInit {

  $id = RandomStringFunction()
  @Input() items: Array<IImageItem> = []

  constructor() { }

  ngAfterViewInit(): void {
    this.init()
  }

  initiation() {
      if ($(window).width() > 991) {
        $(`#${this.$id}`).not(".slick-initialized").slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            speed: 1000,
            dots: false,
            variableWidth: true,
            appendArrows: $(`#${this.$id}`).closest(".section").find('.section__action'),
            prevArrow: '<div class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#CCF1D6"/><path d="M31 22L25 28L31 34" stroke="#00BA34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            nextArrow: '<div class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#CCF1D6"/><path d="M25 34L31 28L25 22" stroke="#00BA34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
            mobileFirst: true,
        });
    } else if ($(`#${this.$id}`).hasClass("slick-initialized")) {
      $(`#${this.$id}`).slick("unslick");
    }
  }

  init() {
    $(window).on('load resize', () => {
        this.initiation()
    });
    this.initiation()
  }

}
