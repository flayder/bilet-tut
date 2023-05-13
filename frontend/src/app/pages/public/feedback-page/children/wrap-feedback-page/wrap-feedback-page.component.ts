import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-feedback-page]',
  templateUrl: './wrap-feedback-page.component.html',
  styleUrls: ['./wrap-feedback-page.component.css']
})
export class WrapFeedbackPageComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  color: string = ""
  id: number = 0
  checked: boolean = true

  form = new FormGroup({
    question: new FormControl<number>(0, [
      Validators.required,
    ]),
    theme: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    text: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(10)
    ]),
    order: new FormControl<string>('', [
      Validators.required,
    ]),
    event_name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
  })

  isChecked(event: any) {
    this.checked = event.target.checked
  }

  constructor(
    private feedback$: FeedbackService,
    private user$: UserService,
    private message$: MessageService
  ) { }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {

      this.user$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      this.feedback$.create(this.form.value).subscribe(response => {
        this.message$.handle("Форма была успешно отправлена", "success")
        window.location.reload()
      })
    }
  }

  ngOnInit() {

  }

}
