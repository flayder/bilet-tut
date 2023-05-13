import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { DesignService } from 'src/app/services/design.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-wrap-banner-detail-page]',
  templateUrl: './wrap-banner-detail-page.component.html',
  styleUrls: ['./wrap-banner-detail-page.component.css']
})
export class WrapBannerDetailPageComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false
  id: number = 0

  form = new FormGroup(
    {
      name: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      position: new FormControl<number>(1, [
        Validators.required
      ]),
      type: new FormControl<number>(0, [
        Validators.required
      ]),
      title: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      subtitle: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      link: new FormControl<string>('', [
        Validators.minLength(4),
        Validators.required
      ]),
      date: new FormControl<string>('', [
        Validators.required
      ]),
      is_banner: new FormControl(true),
      image: new FormControl<any>('', [
        Validators.required
      ]),
    },
  )

  constructor(
    private router$: Router,
    private params$: ActivatedRoute,
    private design$: DesignService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.params$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id')) {
        this.design$.getSlider(params.id)
          .subscribe((response: IHttpResponse) => {
            this.id = params.id
            const param: any = response.results
            if(param.type) {
              param.event = param.type.id
            }
            setTimeout(() => {
              this.defaultValue.next(param)
            }, 1000)
          })
      }
    })
  }

  ngOnInit(): void {
  }

  delete() {
    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == this.id) {
        this.design$.deleteSlider(this.id).subscribe(() => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.router$.navigateByUrl("/account/design")
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Баннер успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: this.id,
      type: 'delete',
      text: 'Вы действительно хотите удалить баннер?',
      buttonText: 'Удалить'
    })
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form.value', this.form.value)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = ConfigurateFormData(this.form.value)
      this.design$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(this.id > 0) {
        this.design$.updateSlider(this.id, data).subscribe(response => {
          this.message$.handle('Слайдер успешно обновлено', 'success')
          this.router$.navigateByUrl("/account/design")
        })
      } else {
        this.design$.addSlider(data).subscribe(response => {
          this.message$.handle('Слайдер успешно создано', 'success')
          this.router$.navigateByUrl("/account/design")
        })
      }
    }
  }

}
