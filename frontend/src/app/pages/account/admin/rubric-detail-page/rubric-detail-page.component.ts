import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rubric-detail-page',
  templateUrl: './rubric-detail-page.component.html',
  styleUrls: ['./rubric-detail-page.component.css']
})
export class RubricDetailPageComponent implements AfterContentInit {

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
