import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BaoService } from 'src/app/services/bao.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-basket-discount]',
  templateUrl: './basket-discount.component.html',
  styleUrls: ['./basket-discount.component.css']
})
export class BasketDiscountComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()

  form = new FormGroup({
    discount: new FormControl<string>('', [
      Validators.minLength(2)
    ]),
  })

  constructor(
    private bao$: BaoService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
    
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
      const name: any = this.form.value.discount 
      this.bao$.setDiscount(name).subscribe((response: IHttpResponse) => {
        const results = response.results
        if(results && typeof results == "object" && results.hasOwnProperty('id')) {
          localStorage.setItem('discount', JSON.stringify(results))
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Скидка была успешно применена'
          })
          this.bao$.getCurrentBasket()
        } else {
          this.modal$.open('notification-tiny', {
            type: 'error',
            text: 'Скидка не была применена'
          })
        }
      })
    }
  }

}
