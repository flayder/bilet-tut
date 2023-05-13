import { Component, OnInit } from '@angular/core';
import { DateRussian } from 'src/app/exports/classes/DateRussianClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISliderItem } from 'src/app/exports/interfaces/ISliderItem';
import { DesignService } from 'src/app/services/design.service';


@Component({
  selector: 'div[data-app-bottom-banner]',
  templateUrl: './bottom-banner.component.html',
  styleUrls: ['./bottom-banner.component.css']
})
export class BottomBannerComponent implements OnInit
 {

  item: ISliderItem

  constructor(
    private design$: DesignService
  ) { }

  getMonth(num: any) {
    return DateRussian.getShortMonth(num)
  }

  ngOnInit(): void {
    this.design$.getSliders({
      is_banner: true,
      ordering: "?"
    })
      .subscribe((response: IHttpResponse) => {
        if(Array.isArray(response.results) && response.results.length)
          this.item = response.results[0]
      })
  }

}
