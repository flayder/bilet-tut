import { Component, OnInit } from '@angular/core';
import { IRubricItem } from 'src/app/exports/interfaces/IRubricItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: '[data-app-design-rubric-tab]',
  templateUrl: './design-rubric-tab.component.html',
  styleUrls: ['./design-rubric-tab.component.css']
})
export class DesignRubricTabComponent implements OnInit {

  genres: ISelectValue[] = []
  sorting: ISelectValue[] = [
    {
      name: 'По название',
      value: 'name'
    },
    {
      name: 'По дате',
      value: 'date'
    },
  ]

  items: IRubricItem[] = []
  search: string = ''
  genre: number = 0
  sort: string = ''
  init: boolean = false

  constructor(
    private design$: DesignService
  ) { 
    this.design$.rubrics.subscribe(items => {
      this.items = items

      if(!this.init) {
        this.init = true

        const arr: ISelectValue[] = []

        this.items.map(item => {
          item.genres.map(genre => {
            if(arr.filter(i => i.value == genre.id).length == 0) {
              arr.push({
                name: genre.name,
                value: genre.id
              })
            }
          })
        })

        this.genres = arr
      }
    })
  }

  getSearch(search: any) {
    this.search = search.target.value
    this.getRequest()
  }

  getGenre(genre: any) {
    this.genre = genre
    this.getRequest()
  }

  getSort(sort: string) {
    this.sort = sort
    this.getRequest()
  }

  getRequest() {
    const params: any = {}
    
    if(this.search)
      params.search = this.search

    if(this.sort)
      params.ordering = this.sort

    if(this.genre)
      params.genres = this.genre

    this.design$.getRubrics(params)
  }

  ngOnInit(): void {
    this.getRequest()
  }

}
