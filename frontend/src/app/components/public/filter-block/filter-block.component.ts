import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IEventArea } from 'src/app/exports/interfaces/IEventArea';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { SearchPageType } from 'src/app/exports/types/SearchPageType';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'div[data-app-filter-block]',
  templateUrl: './filter-block.component.html',
  styleUrls: ['./filter-block.component.css']
})
export class FilterBlockComponent implements OnInit {

  area: Array<ISelectValue>
  genre: Array<ISelectValue>
  query: any = {}

  @Input() pageType: SearchPageType = "search"
  @Input() showGenre: boolean = false

  form = new FormGroup({
    search: new FormControl<string>(''),
    dates__start_date: new FormControl(''),
    area: new FormControl<string>(''),
    genre: new FormControl('')
  })

  constructor(
    private event$: EventService,
    private router$: Router
  ) { }

  ngOnInit(): void {
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

    if(this.showGenre) {
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
    console.log('filter-block')
    let pageType = this.pageType
    if(!pageType) pageType = 'search'


    this.router$.navigate([pageType], {
      queryParams: this.form.value
    })
  }
}
