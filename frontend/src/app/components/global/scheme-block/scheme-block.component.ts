import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from 'src/app/exports/pipes/safepipe';

declare var $: any

@Component({
  selector: '[data-app-scheme-block]',
  templateUrl: './scheme-block.component.html',
  styleUrls: ['./scheme-block.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SchemeBlockComponent implements OnInit {

  @Input() html: string = ''
  @Input() identical: string = ''
  @Output() update = new EventEmitter()

  constructor(
    private dom$: DomSanitizer,
    private safe$: SafePipe
  ) { }

  ngOnInit(): void {
    if(this.html && this.identical) {
      this.sceneFunction()
    }
  }

  sceneFunction() {
    let zoom = 1,
        sceneColor = $(".categories__input:checked").siblings(".categories__main").find(".categories__background").css("background-color");
    $(document).on("click", `#${this.identical} .size__item`, (el: any) => {
        if($(el.target).hasClass("size__item_plus") && zoom < 2) zoom += .1;
        if($(el.target).hasClass("size__item_minus") && zoom > 1) zoom -= .1;
        $(`#${this.identical} .scene__image`).find("svg").css("transform", "scale(" + zoom + ")");
    });
    // $(document).on("change", `#${this.$id} .categories__input`, (el: any) => {
    //     if($(el.target).prop("checked")) sceneColor =  $(el.target).siblings(".categories__main").find(".categories__background").css("background-color");
    // });
    // $(".scene").find(".scene__image").on("click", "rect", function () {
    //     $(this).css("fill", sceneColor);
    // });
}

  safe() {
    this.update.emit(true)
    return this.safe$.transform(this.html)
  }

}
