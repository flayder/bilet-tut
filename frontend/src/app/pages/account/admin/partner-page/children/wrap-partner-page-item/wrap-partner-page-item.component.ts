import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUserItem } from 'src/app/exports/interfaces/IUserItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tr[data-app-wrap-partner-page-item]',
  templateUrl: './wrap-partner-page-item.component.html',
  styleUrls: ['./wrap-partner-page-item.component.css']
})
export class WrapPartnerPageItemComponent implements OnInit {

  @Input() item: IUserItem

  constructor(
    private user$: UserService,
    private router$: Router
  ) { }

  ngOnInit(): void {
  }

  getName() {
    return this.user$.getUserName(this.item)
  }

  detail(event: any) {
    event.preventDefault()
    
    return this.router$.navigateByUrl(`/account/partners/${this.item.id}`)
  }

}
