import { Component, OnInit } from '@angular/core';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISliderItem } from 'src/app/exports/interfaces/ISliderItem';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: '[data-app-design-slide-tab]',
  templateUrl: './design-slide-tab.component.html',
  styleUrls: ['./design-slide-tab.component.css']
})
export class DesignSlideTabComponent implements OnInit {

  items: ISliderItem[] = []

  constructor(
    private design$: DesignService
  ) { }

  ngOnInit(): void {
    this.design$.getSliders({is_banner: false}).subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results))
        this.items = response.results
    })
  }

}
