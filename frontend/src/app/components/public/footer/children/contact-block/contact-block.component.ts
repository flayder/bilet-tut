import { Component, OnInit } from '@angular/core';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IPageItem } from 'src/app/exports/interfaces/IPageItem';
import { PageService } from 'src/app/services/page.service';

declare var $: any

@Component({
  selector: 'app-contact-block',
  templateUrl: './contact-block.component.html',
  styleUrls: ['./contact-block.component.css']
})
export class ContactBlockComponent implements OnInit {

  item: IPageItem

  constructor(
    private page$: PageService
  ) { }

  ngOnInit(): void {
    this.page$.getPage('footer').subscribe((response: IHttpResponse) => {
      if(response.results)
        this.item = response.results
    })
  }

}
