import { Component, OnInit, Input } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {delay, tap} from "rxjs/operators";

@Component({
  selector: '[data-app-image]',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  src$ = new BehaviorSubject<string>("/assets/img/preview.jpg")

  @Input() class: string | undefined
  @Input() preview: string
  @Input() src: string
  @Input() alt: string | undefined
  @Input() delay: number

  constructor() { }

  ngOnInit(): void {
    const preview = this.src$
    if(!this.preview) this.preview = preview.value

    if(!this.src) this.src = this.src$.getValue()

    // if(this.src) {
    //   preview.pipe(
    //     delay(this.delay > 0 ? this.delay : 500),
    //     tap(() => this.preview = this.src)
    //   ).subscribe()
    // }
  }

}
