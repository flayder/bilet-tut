import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'div[data-app-modal-notification]',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.css']
})
export class ModalNotificationComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams
  title: string = ''
  id: any = false
  modalText: any = 'notification-tiny'

  constructor(
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
    if(this.params.type == this.modalText) {
      const successTitle: string = 'Успешно'
      const errorTitle: string = 'Ошибка'
      const deleteTitle: string = 'Удаление'

      let title = false

      if(this.params.params.id)
        this.id = this.params.params.id

      if(this.params.params.title) {
        title = true
      }

      if(this.params.params.type == 'success') {
        if(title)
          this.title = this.params.params.title
        else
          this.title = successTitle
      }

      if(this.params.params.type == 'error') {
        if(title)
          this.title = this.params.params.title
        else
          this.title = errorTitle
      }

      if(this.params.params.type == 'delete') {
        if(title)
          this.title = this.params.params.title
        else
          this.title = deleteTitle
      }
    }
  }

  close() {
    this.data.emit(this.modalText)
  }

  clicking() {
    this.close()
    if(this.id) {
      this.modal$.buttonClick.next(this.id)
    }
  }

}
