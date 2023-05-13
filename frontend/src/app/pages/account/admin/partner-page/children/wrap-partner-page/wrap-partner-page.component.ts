import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

type PartnerType = "items" | "searchs"

@Component({
  selector: '[data-app-wrap-partner-page]',
  templateUrl: './wrap-partner-page.component.html',
  styleUrls: ['./wrap-partner-page.component.css']
})
export class WrapPartnerPageComponent implements OnInit {

  form = new FormGroup({
    search: new FormControl<string>('')
  })

  type: string = 'user'

  items: IUserItem[] = []
  searchs: IUserItem[] = []

  constructor(
    private user$: UserService
  ) { }

  setType(type: string) {
    this.type = type
  }

  ngOnInit(): void {
    this.getRequest('items')
  }

  getRequest(type: PartnerType) {
    this.user$.admin.getUser(this.form.value)
      .subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results)) {
        this[type] = response.results
      }
    })
  }

  search() {
    this.getRequest('searchs')
    this.setType('search')
  }

}
