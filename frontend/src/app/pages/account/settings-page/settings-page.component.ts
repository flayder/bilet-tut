import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements AfterContentInit {

  constructor(
    private router$: Router,
    private user$: UserService
  ) { }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe(user => {
    })
    IsAuthorizedFunction(this.user$, this.router$)
  }
}
