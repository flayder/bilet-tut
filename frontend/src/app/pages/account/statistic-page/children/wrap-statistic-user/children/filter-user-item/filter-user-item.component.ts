import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[data-app-filter-user-item]',
  templateUrl: './filter-user-item.component.html',
  styleUrls: ['./filter-user-item.component.css']
})
export class FilterUserItemComponent implements OnInit {

  @Input() item: IBasketItem

  constructor(
    private router$: Router,
    private user$: UserService
  ) { }

  ngOnInit(): void {
  }

  getUserName() {
    const user: any = this.item.user
    return this.user$.getUserName(user)
  }

  getDetail(event: any) {
    event.preventDefault()
    this.router$.navigateByUrl(`/account/statistic/user/${this.item.user?.id}`)
  }

}
