import { Component, OnInit } from '@angular/core';
import { IEventGenre } from 'src/app/exports/interfaces/IEventGenre';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { EventService } from 'src/app/services/event.service';

interface IGenreTypeList {
  [index: string]: IEventGenre[]
}

@Component({
  selector: '[data-app-design-genre-tab]',
  templateUrl: './design-genre-tab.component.html',
  styleUrls: ['./design-genre-tab.component.css']
})
export class DesignGenreTabComponent implements OnInit {

  items: IGenreTypeList = {}
  actives: string[] = []

  constructor(
    private event$: EventService
  ) { }

  configurateData(elements: IEventGenre[] = []) {
    const items: IGenreTypeList = {}

    elements.map(item => {
      const letter = item.name[0].toUpperCase()
      if(items.hasOwnProperty(letter)) {
        items[letter].push(item)
      } else {
        items[letter] = [item]
      }
    })

    this.items = items
  }

  isActive(letter: string) {
    return this.actives.includes(letter)
  }

  toggleFilter(letter: string) {
    const arr: string[] = this.actives
    console.log('lee', letter)
    if(!this.actives.includes(letter)) {
      arr.push(letter)
    } else {
      const index = this.actives.indexOf(letter)
      arr.splice(index, 1)
    }

    this.actives = arr
  }

  clearFilter() {
    this.actives = []
  }

  getLetter(letter: string) {
    return letter
  }

  getItems() {
    const elements: IGenreTypeList = {}

    for(let letter in this.items) {
      if(this.actives.length == 0 || this.actives.includes(letter))
        elements[letter] = this.items[letter]
    }

    return elements
  }

  ngOnInit(): void {
    this.event$.getGenre().subscribe((response: IHttpResponse) => {
      if(Array.isArray(response.results))
        this.configurateData(response.results)
    })
  }

}
