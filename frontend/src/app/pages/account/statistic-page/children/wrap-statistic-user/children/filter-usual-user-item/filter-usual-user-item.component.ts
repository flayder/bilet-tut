import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBasketItem } from 'src/app/exports/interfaces/IBasketItem';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[data-app-filter-usual-user-item]',
  templateUrl: './filter-usual-user-item.component.html',
  styleUrls: ['./filter-usual-user-item.component.css']
})
export class FilterUsualUserItemComponent implements OnInit {

  @Input() item: IUserItem

  constructor(
    private router$: Router,
    private user$: UserService
  ) { }

  ngOnInit(): void {
  }

  getUserName() {
    return this.user$.getUserName(this.item)
  }

  getDetail(event: any) {
    event.preventDefault()
    this.router$.navigateByUrl(`/account/statistic/user/${this.item.id}`)
  }

}
