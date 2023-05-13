import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

declare var $: any

@Component({
  selector: '[data-app-according-range-block]',
  templateUrl: './according-range-block.component.html',
  styleUrls: ['./according-range-block.component.css']
})
export class AccordingRangeBlockComponent implements AfterContentInit {

  @Input() min_val: number = 0
  @Input() max_val: number = 0
  @Output() data = new EventEmitter()
  clear: any

  $id = RandomStringFunction()

  constructor() { }

  ngAfterContentInit(): void {
    if(this.max_val > 0) {
      setTimeout(() => {
        this.init()
      }, 1000)
    }
  }

  init() {
    $(`#${this.$id} .range__slider`).slider({
      range: true,
      min: this.min_val,
      max: this.max_val,
      step: 100,
      values: [this.min_val, this.max_val],
      slide: (event: any, ui: any) => {
        $(`#${this.$id} .range__input_min`).val(ui.values[0])
        $(`#${this.$id} .range__input_max`).val(ui.values[1])
        clearTimeout(this.clear)
        this.clear = setTimeout(() => {
          this.data.emit([ui.values[0], ui.values[1]])
        }, 1000)
      }
    });
    $(`#${this.$id} .range__input_min`).val($(`#${this.$id} .range__slider`).slider("values", 0));
    $(`#${this.$id} .range__input_max`).val($(`#${this.$id} .range__slider`).slider("values", 1));
  }

}
