import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PassConfValidation } from 'src/app/components/validations/passconfvalidation';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recovery-second-page',
  templateUrl: './recovery-second-page.component.html',
  styleUrls: ['./recovery-second-page.component.css']
})
export class RecoverySecondPageComponent implements OnInit {

  authFormSubmit = new Subject()

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ])
  },
  [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  recovery_key: any = ""
  user: any = ""
  
  constructor(
    private user$: UserService,
    private activate$: ActivatedRoute,
    private router$: Router,
    private message$: MessageService
  ) { 
    const params = this.activate$.snapshot.queryParams
    if(typeof params == "object" && params.user && params.recovery_key) {
      this.user = params.user
      this.recovery_key = params.recovery_key
    } else {
      this.router$.navigate([""])
    }
  }

  ngOnInit(): void {
  }

  submit() {
    this.authFormSubmit.next({})
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = new FormData
      const password: any = this.form.value.password
      const confirmPassword: any = this.form.value.confirmPassword

      data.append('password', password)
      data.append('confirmPassword', confirmPassword)
      data.append('user', this.user)
      data.append('recovery_key', this.recovery_key)

      this.user$.recoverySecond(data).subscribe((response: IHttpResponse) => {
        this.message$.handle('Пароль был успешно измнен', 'success')
        this.router$.navigate(["/auth"])
      })
    }
  }

}
