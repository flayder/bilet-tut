import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ICheckoutItem } from 'src/app/exports/interfaces/ICheckoutItem';
import { ICheckoutReturn } from 'src/app/exports/interfaces/ICheckoutReturn';
import { ICheckoutReturnReason } from 'src/app/exports/interfaces/ICheckoutReturnReason';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: '[data-app-wrap-return-page]',
  templateUrl: './wrap-return-page.component.html',
  styleUrls: ['./wrap-return-page.component.css']
})
export class WrapReturnPageComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  checkouts: ISelectValue[] = []
  reasons: ISelectValue[] = []
  id: number = 0
  item: ICheckoutReturn
  
  form = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required
    ]),
    checkout: new FormControl<number>(0, [
      Validators.required
    ]),
    reason: new FormControl<number>(0, [
      Validators.required
    ]),
    description: new FormControl<string>('', [
      Validators.required
    ]),
    seria_passport: new FormControl<string>(''),
    number_passport: new FormControl<string>(''),
    date_passport: new FormControl<string>(''),
    given_passport: new FormControl<string>(''),
    inn_bank: new FormControl<string>(''),
    bik_bank: new FormControl<string>(''),
    receipt_bank: new FormControl<string>(''),
    korr_bank: new FormControl<string>(''),
  })

  constructor(
    private bao$: BaoService,
    private message$: MessageService,
    private activate$: ActivatedRoute
  ) { 
    this.activate$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id') && params.id > 0) {
        this.id = params.id
        this.bao$.getCheckoutReturn(this.id).subscribe((response: IHttpResponse) => {
          if(response.results) {
            this.item = response.results
            for(let item in response.results) {
              const control = this.form.get(item)
              if(control) {
                control.setValue(response.results[item])
              }
            }

            setTimeout(() => {
              this.defaultValue.next(response.results)
            }, 1000)
          }
        })
      }
    })
  }

  ngOnInit(): void {
    this.bao$.getOrders({status: 2}).subscribe((respoense: IHttpResponse) => {
      if(Array.isArray(respoense.results)) {
        const arr: any = []
        respoense.results.map((item: ICheckoutItem) => {
          arr.push({
            name: `Заказ №${item.id}`,
            value: item.id
          })
        })
        this.checkouts = arr
      }
    })
    this.bao$.getCRReasons().subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        const arr: any = []
        response.results.map((item: ICheckoutReturnReason) => {
          arr.push({
            name: item.name,
            value: item.id
          })
        })
        this.reasons = arr
      }
    })
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('fieldsDefault', this.form)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {

      this.bao$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(this.id == 0) {
        this.bao$.addCheckoutReturn(this.form.value).subscribe(response => {
          this.message$.handle('Запрос на вовраз был успешно создан', 'success')
          window.location.reload()
        })
      } else {
        this.bao$.updateCheckoutReturn(this.id, this.form.value).subscribe(response => {
          this.message$.handle('Запрос на вовраз был успешно обновлен', 'success')
        })
      }

    }
  }

}
