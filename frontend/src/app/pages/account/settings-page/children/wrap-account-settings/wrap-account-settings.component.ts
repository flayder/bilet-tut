import { Component, OnInit } from '@angular/core';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-wrap-account-settings]',
  templateUrl: './wrap-account-settings.component.html',
  styleUrls: ['./wrap-account-settings.component.css']
})
export class WrapAccountSettingsComponent implements OnInit {

  user: IUserItem
  type: string = "lk"

  constructor(
    private user$: UserService
  ) { 
    this.user$.user.subscribe(user => {
      if(user && typeof user == 'object' && 'id' in user) {
        this.user = user
      }
    })
  }

  getRole(role: string) {
    return this.user && 'role' in this.user && this.user.role == role
  }

  ngOnInit(): void {
  }

  setType(value: string) {
    this.type = value
  }

}
