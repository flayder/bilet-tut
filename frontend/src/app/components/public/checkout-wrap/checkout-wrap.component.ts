import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { PHONE_REG_EXP } from 'src/app/exports/constans';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { AccountService } from 'src/app/services/account.service';
import { BaoService } from 'src/app/services/bao.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';
import { PassConfValidation } from '../../validations/passconfvalidation';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';

type CheckoutType = "phys" | "legal"

@Component({
  selector: 'div[data-app-checkout-wrap]',
  templateUrl: './checkout-wrap.component.html',
  styleUrls: ['./checkout-wrap.component.css']
})
export class CheckoutWrapComponent implements OnInit {

  auth: boolean = false
  items: IBasketItem[] = []
  user: CurrentUserType = false
  type: CheckoutType = "phys"
  payment: number
  errors: Subject<any> = new Subject()
  errorsLegal: Subject<any> = new Subject()
  legalSubmit: Subject<any> = new Subject()
  defaultPsyhValue = new Subject()
  defaultLegalValue = new Subject()

  formSubmit: Subject<any> = new Subject()

  physicForm = new FormGroup(
    {
      login: new FormControl(''),
      username: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      phone: new FormControl<string>('', [
        Validators.pattern(PHONE_REG_EXP),
        Validators.required
      ]),
      surname: new FormControl<string>('', [
        Validators.minLength(4),
      ]),
      email: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      password: new FormControl<string>('', [
        Validators.minLength(6),
        Validators.required
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.minLength(6),
        Validators.required
      ]),
      abilet: new FormControl<boolean>(true),
    },
    [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  legalForm = new FormGroup(
    {
      login: new FormControl(''),
      organisation_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_first_name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      legal_address: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      kpp: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      inn: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      phone: new FormControl<string>('', [
        Validators.pattern(PHONE_REG_EXP),
        Validators.required
      ]),
      email: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      password: new FormControl<string>('', [
        Validators.minLength(6),
        Validators.required
      ]),
      confirmPassword: new FormControl<string>('', [
        Validators.minLength(6),
        Validators.required
      ]),
      is_legal: new FormControl<boolean>(true),
      abilet: new FormControl<boolean>(true),
    },
    [PassConfValidation.MatchValidator('password', 'confirmPassword')]
  )

  constructor(
    private user$: UserService,
    private bao$: BaoService,
    private account$: AccountService,
    private router$: Router,
    private modal$: ModalService
  ) { 
    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.auth = true
        this.user = user
      }
    })
  }

  setPayment(id: number) {
    this.payment = id
  }

  submit() {
    this.bao$.response.subscribe((response: IHttpResponse) => {
      //const response: any = {"results":{"orderId":"7ea75069-0070-7159-be67-87852908a320","url":"https://secure-payment-gateway.ru/payment/merchants/sbersafe_sberid/payment_ru.html?mdOrder=7ea75069-0070-7159-be67-87852908a320"}}
      if(response.results === true) {
        this.modal$.open('notification-tiny', {
          type: 'success',
          text: "Заказ успешно оформлен"
        })
        this.router$.navigate(["/"])
      } else if(typeof response.results == "object") {
        window.open(
          response.results.url,
          '_blank'
        )

        const id$: any = RandomStringFunction()

        this.modal$.buttonClick.subscribe((i:any) => {
          if(i == id$) {
            window.open(
              response.results.url,
              '_blank'
            )
          }
        })

        this.modal$.open('notification-tiny', {
          id: id$,
          type: 'success',
          text: 'Заказ успешно оформлен',
          buttonText: 'Повторить оплату'
        })

      }
      localStorage.setItem('discount', '')
    })
    const params: any = {
      payment: this.payment
    }
    const discount = this.bao$.getLocalDiscount()

    if(discount && typeof discount == "object" && discount.hasOwnProperty('id'))
      params.discount = discount.id

    this.bao$.checkOut(params)
  }

  process(data: any) {
    data.login = data.email

    if(!this.auth) {
      this.account$.authResponse.subscribe((res: IHttpResponse) => {
        if(res.results.hasOwnProperty('token')) {
          this.submit()
        }
      })
      this.account$.registerResponse.subscribe((response: IHttpResponse) => {
        if(response.results) {
          data.login = data.email
          this.account$.auth({
            login: data.login,
            password: data.password
          })
        }
      })
      this.account$.register(data)
    } else {
      // this.account$.registerResponse.subscribe((response: IHttpResponse) => {
      // })
  
      if(typeof this.user == 'object' && 'id' in this.user) {
        this.account$.updateUser(this.user.id, data)
        this.submit()
      }
    }
    
  }

  physicFormSubmit(event: any) {
    this.formSubmit.next({})
    this.errors.next({})
    if(this.auth) {
      this.physicForm.controls.password.setErrors(null)
      this.physicForm.controls.confirmPassword.setErrors(null)
    }

    if(!ErrorHandlerClass.AnyErrors(this.physicForm)) {
      const data = this.physicForm.value
      this.account$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })
      
      this.process(data)
    }
  }

  legalFormSubmit(event: any) {
    this.legalSubmit.next({})
    this.errorsLegal.next({})

    if(this.auth) {
      this.legalForm.controls.password.setErrors(null)
      this.legalForm.controls.confirmPassword.setErrors(null)
    }
    
    if(!ErrorHandlerClass.AnyErrors(this.legalForm)) {
      const data: any = this.legalForm.value
      data.username = data.legal_name
      this.account$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errorsLegal.next(errors.error)
      })

      this.process(data)
    }
  }

  ngOnInit(): void {
    this.user$.user.subscribe((data: CurrentUserType) => {
      this.user = data
      if(data) {
        setTimeout(() => {
          this.defaultPsyhValue.next(data)
          this.defaultLegalValue.next(data)
        }, 300)
      }
    })
    
    this.bao$.items.subscribe((items: IBasketItem[]) => {
      if(items.length == 0) 
        window.location.href = "/"
      this.items = items
    })
    this.bao$.getCurrentBasket()
  }

  changeType(type: CheckoutType) {
    this.type = type
  }

  haveAccount(event: any) {
    event.preventDefault()
    localStorage.setItem('previousRoute', '/checkout')
    this.router$.navigate(["/auth"])
  }

  getAuth() {
    return !!this.auth
  }

}