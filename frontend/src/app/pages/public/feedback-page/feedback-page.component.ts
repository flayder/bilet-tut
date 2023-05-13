import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { IPageItem } from 'src/app/exports/interfaces/IPageItem';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css']
})
export class FeedbackPageComponent implements OnInit {

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
