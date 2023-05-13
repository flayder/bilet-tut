import { Component, OnInit } from '@angular/core';

declare var $: any

@Component({
  selector: 'app-about-menu',
  templateUrl: './about-menu.component.html',
  styleUrls: ['./about-menu.component.css']
})
export class AboutMenuComponent implements OnInit {

  constructor() { 
    $(document).on("click", ".footer__section_second .section__header", function (el: any) {
      if($(window).width() < 768) {
        $(el.target).parent().toggleClass("footer__section_active")
      }
    })
  }

  ngOnInit(): void {
  }

}
