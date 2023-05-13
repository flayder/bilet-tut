import { Component, OnInit } from '@angular/core';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'span[data-app-basket]',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  user: CurrentUserType = false

  constructor(
    private user$: UserService
  ) { 
    this.user$.user.subscribe(user => {
      this.user = user
      if(typeof this.user == "object" && this.user.hasOwnProperty('id')) {
        
      }
    })
  }

  ngOnInit(): void {
  }

}
