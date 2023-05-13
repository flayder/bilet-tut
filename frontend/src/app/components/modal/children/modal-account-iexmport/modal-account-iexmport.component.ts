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
  selector: 'div[data-app-modal-account-iexmport]',
  templateUrl: './modal-account-iexmport.component.html',
  styleUrls: ['./modal-account-iexmport.component.css']
})
export class ModalAccountIexportComponent implements OnInit {

  modal: ModalType = 'account-iexmport-tiny'

  @Output() data = new EventEmitter<ModalType>()
  @Input() params: IModalTypeParams

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0

  form = new FormGroup({
    login: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(PHONE_REG_EXP)
    ]),
    username: new FormControl<string>('', [
      Validators.required,
    ]),
    surname: new FormControl<string>('', [
      Validators.required,
    ]),
    lastname: new FormControl<string>('', [
      Validators.required,
    ]),
  })

  constructor(
    private modal$: ModalService,
    private user$: UserService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {
    if(this.params.type == this.modal) {
      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      )
      {
        this.user$.getChecker(this.params.params.id)
          .subscribe((response: IHttpResponse) => {
            if(response.results) {
              if(typeof response.results == "object") {
                for(let key in response.results) {
                  const control = this.form.get(key)
                  if(control) {
                    control.setValue(response.results[key])
                  }

                  if(key == 'id')
                    this.id = response.results[key]
                }
              }
              setTimeout(() => {
                this.defaultValue.next(response.results)
              }, 300)
            }
        })
      }
    }
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {

      this.user$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })
      return
      if(
        typeof this.params.params && 
        this.params.params.hasOwnProperty('edit') &&
        this.params.params.edit
      ) {
        this.user$.updateChecker(this.id, this.form.value).subscribe(response => {
          this.message$.handle('Проверяющий успешно обновлен', 'success')
          this.data.emit(this.modal)
          this.user$.getCheckers()
        })
      } else {
        this.user$.addChecker(this.form.value).subscribe(response => {
          this.message$.handle('Проверяющий успешно добавлен', 'success')
          this.data.emit(this.modal)
          this.user$.getCheckers()
        })
      }
    }
  }

  close(event: any) {
    event.preventDefault()
    this.data.emit(this.modal)
  }

}
