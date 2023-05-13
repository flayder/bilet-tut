import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'div[data-app-search]',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  items: Array<IEventItem> = []
  query: any = this.router$.routerState.snapshot.root.queryParams

  response = new Subject()
  params = new Subject()
  elements = new Subject<IEventItem[]>()

  constructor(
    private event$: EventService,
    private router$: Router,
    private breadcrumb$: BreadcrumbService
  ) { }

  ngOnInit(): void {
    this.breadcrumb$.addItem({
      path: "search",
      name: "Страница поиска"
    })
    this.init()
  }

  getQuery(query: any) {
    setTimeout(() => {
      this.query = query
      this.init()
    }, 500)
  }

  init() {
    this.event$.getList(this.query).subscribe((response: any) => {
      this.params.next(this.query)
      this.response.next(response)
      if(Array.isArray(response.results)) {
        this.items = response.results
      }
    })
  }

}
