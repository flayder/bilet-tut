import { Component, OnInit } from '@angular/core';

declare var $: any

@Component({
  selector: 'div[data-app-header]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.navInit()
    }, 500);
  }

  navInit() {
    $(".header").find(".header__burger").on("click", function (el: any) {
      $(el.target).toggleClass("burger_active");
      if ($(".layout_account").length) {
          $(".layout__sidebar").toggleClass("sidebar_active");
      } else {
          $(".header__nav").toggleClass("header__nav_active");
      }
    });
}

}
