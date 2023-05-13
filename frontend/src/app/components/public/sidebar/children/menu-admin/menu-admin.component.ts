import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: '[data-app-menu-admin]',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.css']
})
export class MenuAdminComponent implements OnInit {

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
