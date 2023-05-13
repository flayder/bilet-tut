import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-scheme-page]',
  templateUrl: './scheme-page.component.html',
  styleUrls: ['./scheme-page.component.css']
})
export class SchemePageComponent implements AfterContentInit {

  constructor(
    private user$: UserService,
    private router$: Router
  ) { }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe((user: any) => {
      if(user && user.hasOwnProperty('role') && user.role != 'admin') {
        this.router$.navigateByUrl("account")
      }
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }

}
