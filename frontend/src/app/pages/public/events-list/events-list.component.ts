import { AfterViewInit, Component } from '@angular/core';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { EventService } from 'src/app/services/event.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements AfterViewInit {

  items: Array<IEventItem> = []
  name: string = ""
  date: any = ""
  response = new Subject()
  params = new Subject()
  elements = new Subject<IEventItem[]>()

  constructor(
    private event$: EventService,
    private router$: Router
  ) { }

  ngAfterViewInit(): void {
    this.elements.subscribe((items) => {
      if(items.length > 0) {
        this.items = items
      }
    })

    this.event$.getList({category: this.getCategorty()}).subscribe((response: IHttpResponse) => {
      this.response.next(response)
      if(Array.isArray(response.results)) {
        this.items = response.results
      }
    })
  }

  getCategorty() {
    const type = this.router$.routerState.snapshot.url.split("/")
    return type[1]
  }

  setParams() {
    const params = {
      search: this.name,
      ordering: this.date,
      category: this.getCategorty()
    }
    this.params.next(params)
    this.event$.getList(params).subscribe(response => {
      this.response.next(response)
      if(Array.isArray(response.results)) {
        this.items = response.results
      }
    })
  }

  setName(name: string) {
    this.name = name
    this.setParams()
  }

  ordering(val: any) {
    this.date = val
    this.setParams()
  }

  // setDate(date: Date) {
  //   this.date = date
  //   this.setParams()
  // }

}
