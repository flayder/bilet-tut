import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IEventGenre } from 'src/app/exports/interfaces/IEventGenre';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';

type IGenreTypeItem = {
  key: string
  value: IEventGenre[]
}

@Component({
  selector: '[data-app-genre-page-item]',
  templateUrl: './genre-page-item.component.html',
  styleUrls: ['./genre-page-item.component.css']
})
export class GenrePageItemComponent implements OnInit {

  @Input() item: IGenreTypeItem

  constructor(
    private router$: Router,
    private event$: EventService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  delete(item: IEventGenre) {

    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.event$.admin.deleteGenre(item.id).subscribe(response => {
          setTimeout(() => {
            window.location.reload()
          }, 2000)
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

  getDetail(item: IEventGenre) {
    this.router$.navigateByUrl(`/account/design/genre/${item.id}`)
  }

}
