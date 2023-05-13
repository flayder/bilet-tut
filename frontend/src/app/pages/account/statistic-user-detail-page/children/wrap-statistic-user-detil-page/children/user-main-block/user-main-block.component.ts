import { Component, Input, OnInit } from '@angular/core';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-user-main-block]',
  templateUrl: './user-main-block.component.html',
  styleUrls: ['./user-main-block.component.css']
})
export class UserMainBlockComponent implements OnInit {

  @Input() user_request: IUserItem
  user: IUserItem
  
  constructor(
    private user$: UserService,
    private modal$: ModalService
  ) { 
    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
      }
    })
  }

  ngOnInit(): void {
  }

  getPhoto() {
    return this.user_request.photo?.image.small ?? ''
  }

  getName() {
    return this.user$.getUserName(this.user_request)
  }

  edit() {
    this.modal$.open('account-user-short', {
      edit: true,
      id: this.user_request.id
    })
  }

}
