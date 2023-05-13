import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { INewItem } from 'src/app/exports/interfaces/INewItem';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: '[data-app-new-item]',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  @Input() item: INewItem
  @Input() is_admin: boolean = false

  constructor(
    private router$: Router,
    private new$: NewsService,
    private message$: MessageService,
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  getDetail(event: any) {
    event.preventDefault()

    if(this.is_admin) {
      this.router$.navigateByUrl(`/account/news/${this.item.id}`)
    } else {
      this.router$.navigateByUrl(`/news/${this.item.id}`)
    }
  }

  delete(event: any) {
    event.preventDefault()

    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.new$.deleteNew(this.item.id).subscribe(response => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.new$.getList()
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

}
