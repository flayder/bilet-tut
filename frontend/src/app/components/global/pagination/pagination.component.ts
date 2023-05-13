import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { PaginationType } from 'src/app/exports/types/PaginationType';
import { EventService } from 'src/app/services/event.service';

type pagType = "next" | "previous"

@Component({
  selector: 'div[data-app-pagination]',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() dataType: PaginationType
  @Input() limit: number = 30

  items: number[] = []
  begin: number = 0
  last: number = 0
  page: number = 1
  count: number = 0
  params: any = {}

  @Input() response: Subject<any>
  @Input() parameters: Subject<any>
  @Input() elements: Subject<any>

  constructor(
    private event$: EventService
  ) { }

  inititate() {
    switch(this.dataType) {
      case "events":
        this.event$.getList(this.configParams({page: this.page})).subscribe(res => {
          this.elements.next(this.configResponse(res))
        })
        break
    }
  }

  configResponse(response: any) {
    if(response.results && Array.isArray(response.results))
      return response.results

    return []
  }

  configParams(params = {}) {
    if(this.params && typeof this.params == "object") {
      return {...this.params, ...params}
    }

    return params
  }

  getShow() {
    return (this.limit < this.count) ? this.limit * this.page : this.count
  }

  getLastPage() {
    return Math.ceil(this.count / this.limit)
  }

  ifPrev() {
    return this.page - 1 >= 1
  }

  prev(event: any = false) {
    if(event) event.preventDefault()

    this.page = this.page - 1
  }

  ifNext() {
    return this.getLastPage() >= this.page + 1
  }

  next(event: any = false) {
    if(event) event.preventDefault()
    
    this.page = this.page + 1
  }

  ifNeedPag() {
    return this.getLastPage() > 1
  }

  initPag() {
    if(this.ifNeedPag()) {
      let begin = 1
      let lastReal = this.getLastPage()
      let last = lastReal

      if(this.page - 4 > 1) {
        begin = this.page - 4
        this.begin = 1
      } else {
        if(this.begin > 0)
          this.begin = 0
      }

      if(this.page + 4 < lastReal) {
        last = this.page + 4
        this.last = lastReal
      } else {
        if(this.last > 0)
          this.last = 0
      }

      const items: number[] = []

      while(begin <= last) {
        items.push(begin)
        begin++
      }

      this.items = items
    }
  }

  isActive(page: number) {
    return this.page == page
  }

  getNumPage(str: string, type: pagType) {
    const arr: any = str.split("?")
    if(arr.length == 1) {
      let some = parseInt(arr[1].replace(/[^0-9]*/, ""))

      if(some > 0) {
        if(type == 'next') {
          some = some - 1
          if(some > 0) {
            if(this.page != some) 
              this.page = some
          }
        } else if(type == 'previous') {
          some = some + 1
          if(some > 0) {
            if(this.page != some) 
              this.page = some
          }
        }
      }
    }
  }

  getPage(response: IHttpResponse) {
    if(response.next)
      this.getNumPage(response.next, 'next')
    else if(response.previous)
      this.getNumPage(response.previous, 'previous')
    else {
      if(this.page > 1)
        this.page = 0

      if(response.count)
        this.count = response.count
      else if(this.count > 0)
        this.count = 0
    }

    if(this.page > 1 && this.getLastPage() < this.page) {
      this.page = 1
    }
  }

  setPage(page: number, event: any = false) {
    if(event) event.preventDefault()

    if(this.page != page) {
      this.page = page
      this.inititate()
      this.initPag()
    }
  }

  ngOnInit(): void {
    if(this.parameters) {
      this.parameters.subscribe(params => {
        if(params && typeof params == "object")
          this.params = params
      })
    }

    if(this.response) {
      this.response.subscribe(response => {
        
        if(response && typeof response == "object" && response.hasOwnProperty('count')) {
          if(this.last > 0)
            this.last = 0

          if(this.begin > 0)
            this.begin = 0

          if(response.count && response.count >= 0)
            this.count = response.count

          this.getPage(response)
          this.initPag()
        }
      })
    }
  }

}
