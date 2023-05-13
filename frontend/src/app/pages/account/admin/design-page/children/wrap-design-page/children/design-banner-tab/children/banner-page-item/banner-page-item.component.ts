import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateRussian } from 'src/app/exports/classes/DateRussianClass';
import { ISliderItem } from 'src/app/exports/interfaces/ISliderItem';
import { DesignService } from 'src/app/services/design.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: '[data-app-banner-page-item]',
  templateUrl: './banner-page-item.component.html',
  styleUrls: ['./banner-page-item.component.css']
})
export class BannerPageItemComponent implements OnInit {

  @Input() item: ISliderItem

  constructor(
    private design$: DesignService,
    private message$: MessageService,
    private router$: Router
  ) { }

  getMonth(num: any) {
    return DateRussian.getShortMonth(num)
  }

  getDetail(event: any) {
    event.preventDefault()

    this.router$.navigateByUrl(`/account/design/banner/${this.item.id}`)
  }

  ngOnInit(): void {
  }

  delete() {
    this.design$.deleteSlider(this.item.id).subscribe(response => {
      this.message$.handle("Баннер был успешно удален", "success")
      window.location.reload()
    })
  }

}
