import { Component, OnInit } from '@angular/core';
import { IUserCheckerItem } from 'src/app/exports/interfaces/ICheckerItem';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-checkin-page]',
  templateUrl: './wrap-checkin-page.component.html',
  styleUrls: ['./wrap-checkin-page.component.css']
})
export class WrapCheckinPageComponent implements OnInit {

  items: Array<IUserCheckerItem> = []

  constructor(
    private modal$: ModalService,
    private user$: UserService
  ) { 
    user$.checkers.subscribe(items => {
      if(Array.isArray(items))
        this.items = items
    })
  }

  ngOnInit(): void {
    this.user$.getCheckers()
  }

  openModal() {
    this.modal$.open('account-checker-tiny')
  }
}
