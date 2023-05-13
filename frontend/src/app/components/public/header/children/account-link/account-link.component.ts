import { AfterContentInit, Component, OnInit } from '@angular/core';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'span[data-app-account-link]',
  templateUrl: './account-link.component.html',
  styleUrls: ['./account-link.component.css']
})
export class AccountLinkComponent implements AfterContentInit {

  user: CurrentUserType = false
  
  constructor(
    private user$: UserService
  ) { 
    this.user$.user.subscribe(user => {
      if(user && typeof user == "object" && user.hasOwnProperty('id')) {
        this.user = user
      }
    })
  }

  ngAfterContentInit(): void {
    this.user$.reloadUser()
  }

  getLogo() {
    if(this.user && typeof this.user == "object") {
      const photo = this.user.photo?.image.small
      if(photo)
        return photo
    }

    return '/assets/img/content/avatar/avatar.png'
  }

}
