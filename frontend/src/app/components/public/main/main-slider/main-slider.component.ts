import { AfterViewInit, Component, Input} from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IRubricItem } from 'src/app/exports/interfaces/IRubricItem';


declare var $: any;

@Component({
  selector: '[data-app-main-slider]',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.css']
})
export class MainSliderComponent implements AfterViewInit {

  @Input() item: IRubricItem

  initiate: boolean = false

  $id = RandomStringFunction()

  items: Array<IEventItem> = []

  constructor(
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.init()
    }, 700)
  }

  init() {
    const slider = $(`#${this.$id}`);
    if (slider.length) {
      $(window).on('load resize', () => {
        this.initiation(slider)
      });
      this.initiation(slider)
    }
  }

  initiation(slider: any) {
    if ($(window).width() > 991) {
      slider.not(".slick-initialized").slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        arrows: true,
        speed: 1000,
        dots: false,
        variableWidth: true,
        appendArrows: slider.closest(".section").find('.section__action'),
        prevArrow: '<div class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#CCF1D6"/><path d="M31 22L25 28L31 34" stroke="#00BA34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
        nextArrow: '<div class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#CCF1D6"/><path d="M25 34L31 28L25 22" stroke="#00BA34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
        mobileFirst: true,
      });
    } else if (slider.hasClass("slick-initialized")) {
        slider.slick("unslick");
    }
    this.initiate = true
  } 

  is_correct(item: IEventItem) {
    let date: any = item.start_date
    return date != 0 && Date.now() < (new Date(date)).getTime()
  }

}
