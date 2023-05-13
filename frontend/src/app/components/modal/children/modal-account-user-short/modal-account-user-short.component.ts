import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { PHONE_REG_EXP } from 'src/app/exports/constans';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IModalTypeParams } from 'src/app/exports/interfaces/IModalTypeParams';
import { ModalType } from 'src/app/exports/types/ModalType';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-modal-account-user-short]',
  templateUrl: './modal-account-user-short.component.html',
  styleUrls: ['./modal-account-user-short.component.css']
})
export class ModalAccountUserShortComponent implements OnInit {

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0
  modal: ModalType = 'account-user-short'

  form = new FormGroup({
    username: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    surname: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(PHONE_REG_EXP)
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    kpp: new FormControl<string>('', [
      Validators.required,
    ]),
    inn: new FormControl<string>('', [
      Validators.required,
    ]),
    organisation_name: new FormControl<string>('', [
      Validators.required,
    ]),
    legal_address: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
  })

  constructor(
    private user$: UserService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
    if(this.params.type == this.modal) {
      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      )
      {
        this.user$.admin.getUserDetail(this.params.params.id)
          .subscribe((response: IHttpResponse) => {
            if(response.results) {
              if(typeof response.results == "object") {
                this.id = this.params.params.id
                
                setTimeout(() => {
                  this.defaultValue.next(response.results)
                }, 300)
              }
            }
        })
      }
    }
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {

      this.user$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      ) {
        this.user$.admin.updateUser(this.id, this.form.value).subscribe(response => {
          this.message$.handle('Данные пользователя успешно обновлены', 'success')
          this.data.emit(this.modal)
          window.location.reload()
        })
      }
    }
  }

  close(event: any) {
    event.preventDefault()

    this.data.emit(this.modal)
  }

}
