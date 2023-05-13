import { Component, OnInit } from '@angular/core';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-sidebar]',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  user: CurrentUserType = false

  constructor(
    private user$: UserService
  ) { 
    user$.user.subscribe(user => {
      if(user && !this.user)
        this.user = user
    })
  }

  getRole(role: string) {
    if(
      typeof this.user == "object" && 
      this.user.hasOwnProperty('role') &&
      this.user.role == role
    ) {
      return true
    }

    return false
  }

  ngOnInit(): void {

  }

}
