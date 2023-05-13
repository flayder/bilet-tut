import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-promocode-page',
  templateUrl: './promocode-page.component.html',
  styleUrls: ['./promocode-page.component.css']
})
export class PromocodePageComponent implements AfterContentInit {

  user: IUserItem

  constructor(
    private user$: UserService,
    private router$: Router
  ) { 
    this.user$.user.subscribe(user => {
      if(typeof user == "object") {
        this.user = user
      }
    })
  }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe((user: any) => {
      if(user && user.hasOwnProperty('role') && user.role == 'viewer') {
        this.router$.navigateByUrl("account")
      }
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }

}
