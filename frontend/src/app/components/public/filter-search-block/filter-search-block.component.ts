import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { SearchPageType } from 'src/app/exports/types/SearchPageType';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'div[data-app-filter-search-block]',
  templateUrl: './filter-search-block.component.html',
  styleUrls: ['./filter-search-block.component.css']
})
export class FilterSearchBlockComponent implements OnInit {

  area: Array<ISelectValue>
  genre: Array<ISelectValue>

  reload: boolean = false

  @Input() pageType: SearchPageType = "search"
  @Output() data = new EventEmitter()

  form = new FormGroup({
    search: new FormControl<string>(''),
    dates__start_date: new FormControl(''),
    area: new FormControl<string>(''),
    genre: new FormControl<string>('')
  })

  query: any = {}

  constructor(
    private event$: EventService,
    private router$: Router,
    private route$: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.query = this.router$.routerState.snapshot.root.queryParams

    this.event$.getArea().subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results) && response.results) {
        const items: Array<ISelectValue> = []
        response.results.map((item: IEventArea) => {
          items.push({
            name: item.name,
            value: item.id
          })
        })
        this.area = items
      }
    })
    this.event$.getGenre().subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results) && response.results) {
        const items: Array<ISelectValue> = []
        response.results.map((item: IEventArea) => {
          items.push({
            name: item.name,
            value: item.id
          })
        })
        this.genre = items
      }
    })
  }

  ordering(val: any) {
    this.query = {
      ...this.query,
      ordering: val
    }
    if(this.reload)
      this.search()

    if(!this.reload)
      this.reload = true
  }

  getQuery(name: string) {
    const query: any = this.query
    const form: any = this.form

    if(query.hasOwnProperty(name) && form.value.hasOwnProperty(name) && form.value[name] != query[name]) {
      return query[name]
    } else if(form.value.hasOwnProperty(name))
      return form.value[name]
    return ''
  }

  searchForm() {
    this.search()
  }

  search() {
    const query = {
      ...this.query,
      ...this.form.value
    }
    console.log('filter-search-block')
    if(window.location.pathname != "/search") {
      this.router$.navigate([this.pageType], {
        queryParams: query,
      })
    } else {
      
      this.router$.navigate([this.pageType], {
        queryParams: query
      })
      this.data.emit(query)
      // if(this.reload)
      //   window.location.reload()
    }
    //this.event$.getList(query)
  }
}
