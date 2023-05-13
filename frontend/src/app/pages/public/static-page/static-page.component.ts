import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PageService } from '../../../services/page.service';
import { BreadcrumbService } from '../../../services/breadcrumb.service';
import { Router } from '@angular/router';
import { IPageItem } from '../../../exports/interfaces/IPageItem';
import { IHttpResponse } from '../../../exports/interfaces/IHttpResponse';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StaticPageComponent implements OnInit {

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
      }, true)

      this.title.setTitle(page.seo_title ? page.seo_title : page.h1)
      this.meta.addTag({
        name: 'description',
        content: page.seo_description
      })

      this.page = page
    })
  }

}
