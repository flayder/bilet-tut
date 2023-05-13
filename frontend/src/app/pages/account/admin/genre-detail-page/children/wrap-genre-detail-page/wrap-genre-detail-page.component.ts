import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '[data-app-wrap-genre-detail-page]',
  templateUrl: './wrap-genre-detail-page.component.html',
  styleUrls: ['./wrap-genre-detail-page.component.css']
})
export class WrapGenreDetailPageComponent implements OnInit {

  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false
  id: number = 0

  form = new FormGroup(
    {
      code: new FormControl<string>('', [
        Validators.minLength(3),
        Validators.required
      ]),
      name: new FormControl<string>('', [
        Validators.minLength(3),
        Validators.required
      ]),
    },
  )

  constructor(
    private router$: Router,
    private params$: ActivatedRoute,
    private event$: EventService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.params$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id')) {
        this.event$.admin.getGenreDetail(params.id)
          .subscribe((response: IHttpResponse) => {
            this.id = params.id
            setTimeout(() => {
              this.defaultValue.next(response.results)
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
        this.event$.admin.deleteGenre(this.id).subscribe(() => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.router$.navigateByUrl("/account/design")
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Жанр был успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить жанр?',
      buttonText: 'Удалить'
    })
    
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form.value', this.form.value)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = ConfigurateFormData(this.form.value)
      this.event$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(this.id > 0) {
        this.event$.admin.updateGenre(this.id, data).subscribe(response => {
          //this.message$.handle('Жанр успешно обновлен', 'success')
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Жанр успешно обновлен'
          })
          this.router$.navigateByUrl("/account/design")
        })
      } else {
        this.event$.admin.addGenre(data).subscribe(response => {
          //this.message$.handle('Жанр успешно создан', 'success')
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Жанр успешно создан'
          })
          this.router$.navigateByUrl("/account/design")
        })
      }
    }
  }

}
