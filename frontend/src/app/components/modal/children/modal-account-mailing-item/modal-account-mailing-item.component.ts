import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { ModalType } from 'src/app/exports/types/ModalType';

@Component({
  selector: 'div[data-app-modal-account-mailing-item]',
  templateUrl: './modal-account-mailing-item.component.html',
  styleUrls: ['./modal-account-mailing-item.component.css']
})
export class ModalAccountMailingItemComponent implements OnInit {

  modal: ModalType = 'account-mailing-item-tiny'

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

  users: IUserItem[] = []

  constructor() { }

  ngOnInit(): void {
    if(this.params.type == this.modal) {
      console.log('this.params', this.params)
      if(Array.isArray(this.params.params))
        this.users = this.params.params
    }
  }

  close(event: any) {
    event.preventDefault()
    this.data.emit(this.modal)
  }

}
