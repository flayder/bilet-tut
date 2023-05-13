import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ErrorHandlerClass } from 'src/app/exports/classes/ErrorHandlerClass';
import { ConfigurateFormData } from 'src/app/exports/functions/ConfigurateFormData';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { INewItem } from 'src/app/exports/interfaces/INewItem';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: '[data-app-wrap-news-detail-page]',
  templateUrl: './wrap-news-detail-page.component.html',
  styleUrls: ['./wrap-news-detail-page.component.css']
})
export class WrapNewsDetailPageComponent implements OnInit {

  item: INewItem
  formSubmit: Subject<any> = new Subject()
  defaultValue = new Subject()
  errors: Subject<any> = new Subject()
  photo: any = false

  id: number = 0

  form = new FormGroup(
    {
      image: new FormControl('', [
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
      content: new FormControl<string>('', [
        Validators.minLength(10),
        Validators.required
      ]),
    },
  )

  constructor(
    private router$: Router,
    private param$: ActivatedRoute,
    private new$: NewsService,
    private message$: MessageService,
    private modal$: ModalService
  ) { 
    this.param$.params.subscribe(params => {
      if(typeof params == "object" && params.hasOwnProperty('id')) {
        this.id = params.id
        this.new$.getNewDetail(this.id).subscribe((response: IHttpResponse) => {
          this.item = response.results
          setTimeout(() => {  
            this.defaultValue.next(this.item)
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
        this.new$.deleteNew(this.item.id).subscribe(response => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.router$.navigateByUrl("/account/news")
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Новость успешно удалена'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить новость?',
      buttonText: 'Удалить'
    })
  }

  save() {
    this.formSubmit.next({})
    this.errors.next({})
    console.log('this.form.value', this.form.value)
    if(!ErrorHandlerClass.AnyErrors(this.form)) {
      const data = ConfigurateFormData(this.form.value)
      
      this.new$.getErrors().subscribe(errors => {
        if(errors.hasOwnProperty('error'))
          this.errors.next(errors.error)
      })

      if(this.id == 0) {
        this.new$.addNew(data).subscribe(response => {
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Новость успешно добавлена'
          })
          this.router$.navigateByUrl("/account/news")
        })
      } else {
        this.new$.updateNew(this.id, data).subscribe(response => {
          this.modal$.open('notification-tiny', {
            type: 'success',
            text: 'Новость успешно обновлена'
          })
          this.router$.navigateByUrl("/account/news")
        })
      }
    }
  }
}
