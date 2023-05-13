import { Component, Input, OnInit } from '@angular/core';
import { ILoggingItem } from 'src/app/exports/interfaces/ILoggingItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[data-app-logging-item]',
  templateUrl: './logging-item.component.html',
  styleUrls: ['./logging-item.component.css']
})
export class LoggingItemComponent implements OnInit {

  @Input() item: ILoggingItem

  constructor(
    private user$: UserService
  ) { }

  ngOnInit(): void {
  }

  getRole() {
    switch(this.item.user.role) {
      case 'admin':
        return 'Администратор'

      case 'manager':
        return 'Организатор'

      default:
        return 'Пользователь'
    }
  }

  getName() {
    return this.user$.getUserName(this.item.user)
  }

}
