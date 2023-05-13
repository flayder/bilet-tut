import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IRubricItem } from 'src/app/exports/interfaces/IRubricItem';
import { DesignService } from 'src/app/services/design.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-rubric-page-item]',
  templateUrl: './rubric-page-item.component.html',
  styleUrls: ['./rubric-page-item.component.css']
})
export class RubricPageItemComponent implements OnInit {

  @Input() item: IRubricItem

  constructor(
    private router$: Router,
    private design$: DesignService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  delete() {
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.design$.deleteRubric(this.item.id).subscribe(response => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.design$.getRubrics()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Рубрика была успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить рубрику?',
      buttonText: 'Удалить'
    })
    
  }

  getDetail(event: any) {
    event.preventDefault()

    this.router$.navigateByUrl(`/account/design/rubric/${this.item.id}`)
  }

}
