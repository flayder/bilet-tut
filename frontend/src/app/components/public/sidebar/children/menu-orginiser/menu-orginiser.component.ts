import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: '[data-app-menu-orginiser]',
  templateUrl: './menu-orginiser.component.html',
  styleUrls: ['./menu-orginiser.component.css']
})
export class MenuOrginiserComponent implements OnInit {

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
