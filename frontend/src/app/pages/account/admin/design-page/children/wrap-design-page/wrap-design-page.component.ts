import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[data-app-wrap-design-page]',
  templateUrl: './wrap-design-page.component.html',
  styleUrls: ['./wrap-design-page.component.css']
})
export class WrapDesignPageComponent implements OnInit {

  tabType: string = 'slide'

  constructor() { }

  ngOnInit(): void {
  }

  setType(type: string) {
    this.tabType = type
  }

}
