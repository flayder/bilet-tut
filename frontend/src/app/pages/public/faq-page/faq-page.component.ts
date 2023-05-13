import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPageItem } from '../../../exports/interfaces/IPageItem';
import { PageService } from '../../../services/page.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { Title, Meta } from '@angular/platform-browser';
import { IHttpResponse } from '../../../exports/interfaces/IHttpResponse';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.css']
})
export class FaqPageComponent implements OnInit {

  page: IPageItem | false = false

  constructor(
    private router$: Router,
    private page$: PageService,
    private breadcrubms$: BreadcrumbService,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit(): void {
    const type: any = this.router$.routerState.snapshot.url.split("/")
    this.page$.getPage(type[1]).subscribe((response: IHttpResponse) => {
      const page: IPageItem = response.results
      this.breadcrubms$.addItem({
        path: ``,
        name: page.h1
      })

      this.title.setTitle(page.seo_title ? page.seo_title : page.h1)
      this.meta.addTag({
        name: 'description',
        content: page.seo_description
      })

      this.page = page
    })
  }

}
