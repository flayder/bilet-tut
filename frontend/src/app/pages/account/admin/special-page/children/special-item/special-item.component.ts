import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISpecialItem } from 'src/app/exports/interfaces/ISpecialItem';

@Component({
  selector: 'tr[data-app-special-item]',
  templateUrl: './special-item.component.html',
  styleUrls: ['./special-item.component.css']
})
export class SpecialItemComponent implements OnInit {

  @Input() item: ISpecialItem

  constructor(
    private router$: Router
  ) { }

  ngOnInit(): void {
  }

  configurateGenres() {
    let str = ''

    this.item.genres.map((item, key) => {
      if(key == 0 || key == 1) {
        if(key == 1)
          str += `, ${item.name}`
        else
          str += item.name
      }
    })

    if(this.item.genres.length > 2)
      str += ` <span class="group__item  group__item_500 no-wrap no-wrap">ещё ${this.item.genres.length - 2}</span>`

    return str
  }

  configurateEvents() {
    let str = ''
    this.item.events.map((item, key) => {
      if(key == 0) {
        str += item.name
      }
    })

    if(this.item.events.length > 1)
      str += ` <span class="group__item  group__item_500 no-wrap no-wrap">ещё ${this.item.events.length - 1}</span>`

    return str
  }

  getDetail(event: any) {
    event.preventDefault()
    this.router$.navigateByUrl(`/account/specials/${this.item.id}`)
  }

}
