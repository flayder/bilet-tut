import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-statistic-user-detail-page',
  templateUrl: './statistic-user-detail-page.component.html',
  styleUrls: ['./statistic-user-detail-page.component.css']
})
export class StatisticUserDetailPageComponent implements AfterContentInit {

  constructor(
    private router$: Router,
    private user$: UserService
  ) { }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe(user => {
      if(typeof user == "object" && user.hasOwnProperty('role') && user.role == 'viewer') {
        this.router$.navigateByUrl("account")
      }
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }

}
