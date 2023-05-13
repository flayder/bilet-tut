import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'div[data-app-menu-user]',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.css']
})
export class MenuUserComponent implements OnInit {

  constructor(
    private account$: AccountService
  ) { }

  ngOnInit(): void {
  }

  logout(event: any) {
    event.preventDefault()
    this.account$.logout()
  }

}
