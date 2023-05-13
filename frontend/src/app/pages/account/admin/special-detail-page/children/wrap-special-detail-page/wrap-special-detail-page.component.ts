import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { SpecialService } from 'src/app/services/special.service';

@Component({
  selector: '[data-app-wrap-special-detail-page]',
  templateUrl: './wrap-special-detail-page.component.html',
  styleUrls: ['./wrap-special-detail-page.component.css']
})
export class WrapSpecialDetailPageComponent implements OnInit {

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
      description: new FormControl<string>('', [
        Validators.minLength(10),
        Validators.required
      ]),
      genres: new FormControl<string[]>([]),
      events: new FormControl<string[]>([])
    },
  )

  getGenre(genre: string[]) {
    //this.form.controls.genres.setValue(genre)
  }

  getEvent(event: string[]) {
    //this.form.controls.events.setValue(event)
  }

  constructor(
    private router$: Router,
    private params$: ActivatedRoute,
    private special$: SpecialService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.params$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id')) {
        this.special$.getSpecial(params.id)
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

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form.value', this.form.value)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = ConfigurateFormData(this.form.value)
      this.special$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(this.id > 0) {
        this.special$.updateSpecial(this.id, data).subscribe(response => {
          
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Спецпредложение успешно обновлено'
          })
          
          //this.message$.handle('Спецпредложение успешно обновлено', 'success')
          this.router$.navigateByUrl("/account/specials")
        })
      } else {
        this.special$.addSpecial(data).subscribe(response => {

          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Спецпредложение успешно создано'
          })

          //this.message$.handle('Спецпредложение успешно создано', 'success')
          this.router$.navigateByUrl("/account/specials")
        })
      }
    }
  }

}
