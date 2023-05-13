import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { ISliderItem } from 'src/app/exports/interfaces/ISliderItem';
import { DesignService } from 'src/app/services/design.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-slider-page-item]',
  templateUrl: './slider-page-item.component.html',
  styleUrls: ['./slider-page-item.component.css']
})
export class SliderPageItemComponent implements OnInit {

  @Input() item: ISliderItem

  constructor(
    private design$: DesignService,
    private message$: MessageService,
    private router$: Router,
    private modal$: ModalService
  ) { }

  getDetail(event: any) {
    event.preventDefault()

    this.router$.navigateByUrl(`/account/design/slider/${this.item.id}`)
  }

  ngOnInit(): void {
  }

  delete() {
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.design$.deleteSlider(this.item.id).subscribe(response => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.design$.getSliders()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Слайд был успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить слайд?',
      buttonText: 'Удалить'
    })
  
  }

}
