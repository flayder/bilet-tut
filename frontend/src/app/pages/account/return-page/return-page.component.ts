import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.css']
})
export class ReturnPageComponent implements AfterContentInit {

  constructor(
    private user$: UserService,
    private router$: Router
  ) { 
    IsAuthorizedFunction(this.user$, this.router$).subscribe(user => {
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }

  ngAfterContentInit(): void {
  }

}
