import { Component, OnInit } from '@angular/core';
import { IMailingItem } from 'src/app/exports/interfaces/IMailingItem';
import { MailingService } from 'src/app/services/mailing.service';

@Component({
  selector: '[data-app-wrap-mailing-page]',
  templateUrl: './wrap-mailing-page.component.html',
  styleUrls: ['./wrap-mailing-page.component.css']
})
export class WrapMailingPageComponent implements OnInit {

  type: string = "sms-tab"
  items: IMailingItem[] = []

  constructor(
    private mailing$: MailingService
  ) { 
    mailing$.mailings.subscribe((items: any) => {
      if(Array.isArray(items))
        this.items = items
    })
  }

  ngOnInit(): void {
    this.mailing$.getMailings()
  }

  getSMS() {
    const arr: IMailingItem[] = []
    this.items.map(item => {
      if(item.type == 'sms')
        arr.push(item)
    })

    return arr
  }

  getEmail() {
    const arr: IMailingItem[] = []
    this.items.map(item => {
      if(item.type == 'email')
        arr.push(item)
    })

    return arr
  }

  setType(type: string) {
    this.type = type
  }

}
