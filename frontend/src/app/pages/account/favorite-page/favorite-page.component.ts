import { AfterContentInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IsAuthorizedFunction } from 'src/app/exports/functions/IsAuthorizedFunction';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { CurrentUserType } from 'src/app/exports/types/CurrentUserType';
import { AccountService } from 'src/app/services/account.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: '[data-app-favorite-page]',
  templateUrl: './favorite-page.component.html',
  styleUrls: ['./favorite-page.component.css']
})
export class FavoritePageComponent implements AfterContentInit {

  user: CurrentUserType
  items: IEventItem[] = []
  categories: ISelectValue[] = []
  category: any = false
  searching: string = ""

  constructor(
    private router$: Router,
    private user$: UserService,
    private account$: AccountService
  ) { }

  ngAfterContentInit(): void {
    IsAuthorizedFunction(this.user$, this.router$).subscribe(user => {
      if(user && !this.user)
        this.user = user
    })
    IsAuthorizedFunction(this.user$, this.router$)
    this.init()
  }

  init(data = {}) {
    this.account$.getFavorites(data).subscribe((response: IHttpResponse) => {
      if(response.results) {
        this.items = response.results
        this.getCategories()
      }
    })
  }

  getCategories() {
    const categories: ISelectValue[] = this.categories
    this.items.map(item => {
      //let found: any = false
      if(categories.filter(itm => itm.value == item.type.id).length == 0)
        categories.push({
          name: item.type.name,
          value: item.type.id
        })

    })

    this.categories = categories
  }

  setCategory(val: any) {
    this.category = val
    this.init({
      role: this.category
    })
  }

  search(event: any) {
    this.searching = event.target.value
    this.init({
      search: this.searching,
      role: this.category
    })
  }

}
