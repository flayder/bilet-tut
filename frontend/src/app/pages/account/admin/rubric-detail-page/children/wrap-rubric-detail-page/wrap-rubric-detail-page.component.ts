import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { DesignService } from 'src/app/services/design.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-wrap-rubric-detail-page]',
  templateUrl: './wrap-rubric-detail-page.component.html',
  styleUrls: ['./wrap-rubric-detail-page.component.css']
})
export class WrapRubricDetailPageComponent implements OnInit {

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
      image: new FormControl<any>('', [
        Validators.required
      ]),
      events: new FormControl<any[]>([], [
        Validators.required
      ]),
      genres: new FormControl<any[]>([], [
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
        this.design$.getRubric(params.id)
        .subscribe((response: IHttpResponse) => {
          this.id = params.id
          setTimeout(() => {
            const param: any = {}
            for(let item in response.results) {
              if(item == 'genres' || item == 'events') {
                const arr: any = []
                if(Array.isArray(response.results[item])) {
                  response.results[item].map((i: any) => {
                    if(typeof i == "object" && i.hasOwnProperty('id')) {
                      arr.push(`${i.id}`)
                    }
                  })
                  
                }
                param[item] = arr
              } else {
                param[item] = response.results[item]
              }
            }
            this.defaultValue.next(param)
          }, 1000)
        })
      }
    })
  }

  ngOnInit(): void {
  }

  delete() {
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.design$.deleteSlider(this.id).subscribe(() => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.router$.navigateByUrl("/account/design")
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Рубрика успешно удалена'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить рубрику?',
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
        this.design$.updateRubric(this.id, data).subscribe(response => {
          //this.message$.handle('Рубрика успешно обновлена', 'success')
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Рубрика успешно обновлена'
          })
          this.router$.navigateByUrl("/account/design")
        })
      } else {
        this.design$.addRubric(data).subscribe(response => {
          //this.message$.handle('Рубрика успешно создана', 'success')
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Рубрика успешно создана'
          })
          this.router$.navigateByUrl("/account/design")
        })
      }
    }
  }

}
