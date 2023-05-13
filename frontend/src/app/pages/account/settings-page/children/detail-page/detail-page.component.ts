import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { FORM_ERRORS, LEGAL_STATE_LIST, ORGANISATION_LIST, SELECT_BOOLEAN, TAXES_LIST } from 'src/app/exports/constans';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { AccountService } from 'src/app/services/account.service';
import { MessageService } from 'src/app/services/message.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-detail-page]',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit, AfterContentInit {

  user: IUserItem
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false
  country: string = ''
  countryErrors = new Subject()

  form = new FormGroup(
    {
      org_name_pref: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      tax: new FormControl<string>(TAXES_LIST[0].value, [
        Validators.minLength(4),
        Validators.required
      ]),
      country: new FormControl<number | string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      organisation_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_address: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      ogrn: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      inn: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      kpp: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      nds: new FormControl<string | number>(1, [
        Validators.required
      ]),
      bank_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      bik: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      bank_account: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      kor_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_first_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_last_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_role: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_state: new FormControl<string>(LEGAL_STATE_LIST[0].value, [
        Validators.minLength(4),
        Validators.required
      ]),
    },
  )

  ngAfterContentInit(): void {
  }

  constructor(
    private user$: UserService,
    private account$: AccountService
  ) { 
    // this.account$.registerResponse.subscribe((response: IHttpResponse) => {
    //   this.message$.handle("Настройки были успешно изменены", "success")
    //   this.user$.reloadUser()
    // })
    this.user$.user.subscribe(user => {
      if(user && typeof user == 'object' && 'id' in user) {
        this.user = user
        setTimeout(() => {
          this.defaultValue.next(user)
          if(this.user.country) {
            this.country = this.user.country.name
            this.form.controls.country.setValue(this.user.country.id)
          }
          if(!this.country) {
            this.form.controls.country.setErrors({required: true})
            this.countryErrors.next([FORM_ERRORS.required])
          }
        }, 1000)
      }
    })
    
  }

  setCountry(val: any) {
    if(Number.isInteger(val) && val >= 0) {
      this.form.controls.country.setValue(val)
      this.countryErrors.next([])
    } else {
      this.form.controls.country.setErrors({required: true})
      this.countryErrors.next([FORM_ERRORS.required])
    }
  }

  getSelectDefault() {
    return SELECT_BOOLEAN
  }

  getLegalStateSelectDefault() {
    return LEGAL_STATE_LIST
  }

  getOrganisationSelectDefault() {
    return ORGANISATION_LIST
  }

  getTaxesListSelectDefault() {
    return TAXES_LIST
  }

  ngOnInit(): void {
    
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = new FormData

      const pref: any = this.form.value.org_name_pref
      if(this.form.value.organisation_name?.indexOf(pref) === -1)
        this.form.value.organisation_name = `${pref} ${this.form.value.organisation_name}`


      for(let f in this.form.value) {
        let fields: any = this.form.value
        data.append(f, fields[f])
      }
      
      this.account$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      this.account$.updateUser(this.user.id, data)
    }
  }

}
