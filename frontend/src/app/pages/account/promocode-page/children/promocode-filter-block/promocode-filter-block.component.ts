import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { ISelectValue } from 'src/app/exports/interfaces/ISelectValue';
import { BaoService } from 'src/app/services/bao.service';

@Component({
  selector: '[data-app-promocode-filter-block]',
  templateUrl: './promocode-filter-block.component.html',
  styleUrls: ['./promocode-filter-block.component.css']
})
export class PromocodeFilterBlockComponent implements OnInit {

  init: boolean = false
  items: IDiscountItem[] = []
  genres: ISelectValue[] = []
  genre: number = 0
  events: ISelectValue[] = []
  event: number = 0
  
  searching: any = ''

  form = new FormGroup({
    search: new FormControl<string>('')
  })

  constructor(
    private bao$: BaoService
  ) { 
    this.bao$.discounts.subscribe(items => {
      if(!this.init) {
        this.items = items
        this.getEvents()
        this.getGenres()
        this.init = true
      }
    })
  }

  getDiscounts() {
    const params: any = {}
    if(this.searching) {
      params.search = this.searching
    }

    if(this.genre) {
      params.event__genre = this.genre
    }

    if(this.event) {
      params.event = this.event
    }

    this.bao$.getDiscounts(params)
  }

  ngOnInit(): void {
  }

  getGenre(id: number) {
    this.genre = id
    this.getDiscounts()
  }

  getEvent(id: number) {
    this.event = id
    this.getDiscounts()
  }

  getEvents() {
    const arr: ISelectValue[] = []

    this.items.map(item => {
      if(arr.filter(i => i.value == item.event.id).length == 0) {
        arr.push({
          name: item.event.name,
          value: item.event.id
        })
      }
    })

    this.events = arr
  }

  getGenres() {
    const arr: ISelectValue[] = []

    this.items.map(item => {
      item.event.genre.map(i => {
        if(arr.filter(it => it.value == i.id).length == 0) {
          arr.push({
            name: i.name,
            value: i.id
          })
        }
      })
    })

    this.genres = arr
  }

  search() {
    this.searching = this.form.value.search
    this.getDiscounts()
  }

}
