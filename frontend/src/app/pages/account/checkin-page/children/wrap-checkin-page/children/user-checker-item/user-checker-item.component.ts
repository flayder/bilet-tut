import { Component, Input, OnInit } from '@angular/core';
import { RandomStringFunction } from 'src/app/exports/functions/RandomStringFunction';
import { IUserCheckerItem } from 'src/app/exports/interfaces/ICheckerItem';
import { MessageService } from 'src/app/services/message.service';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[data-app-user-checker-item]',
  templateUrl: './user-checker-item.component.html',
  styleUrls: ['./user-checker-item.component.css']
})
export class UserCheckerItemComponent implements OnInit {

  @Input() item: IUserCheckerItem

  constructor(
    private user$: UserService,
    private modal$: ModalService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {
  }

  edit(id: number, event: any) {
    event.preventDefault()
    this.modal$.open('account-checker-tiny', {
      edit: true,
      id
    })
  }

  delete(id: number, event: any) {
    event.preventDefault()
    const id$: any = RandomStringFunction()

    this.modal$.buttonClick.subscribe((i:any) => {
      if(i == id$) {
        this.user$.deleteChecker(id).subscribe(response => {
          //this.message$.handle("Промокод успешно удален", "success")
          this.user$.getCheckers()
          setTimeout(() => {
            this.modal$.open('notification-tiny', {
              type: 'success',
              text: 'Проверяющий успешно удален'
            })
          }, 200)
        })
      }
    })

    this.modal$.open('notification-tiny', {
      id: id$,
      type: 'delete',
      text: 'Вы действительно хотите удалить проверяющего?',
      buttonText: 'Удалить'
    })
  
  }

}
