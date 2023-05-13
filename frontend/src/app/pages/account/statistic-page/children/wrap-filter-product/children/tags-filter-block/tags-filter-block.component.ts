import { Component, OnInit, Input } from '@angular/core';
import { IEventItem } from '../../../../../../../exports/interfaces/IEventItem';
import { IFilterValue } from '../../../../../../../exports/interfaces/IFilterValue';
import { TAGS_LIST, TAG_REMOVE } from '../../../../../../../exports/constans';

@Component({
  selector: '[data-app-tags-filter-block]',
  templateUrl: './tags-filter-block.component.html',
  styleUrls: ['./tags-filter-block.component.css']
})
export class TagsFilterBlockComponent implements OnInit {

  @Input() items: IFilterValue[] = []
  init: boolean = false
  
  constructor() { 
    TAGS_LIST.subscribe(params => {
      this.items = params
    })
  }

  getFilterName(item: IFilterValue) {
    switch(item.key) {
      case 'area':
        return 'Место проведения'
        break
      case 'genre':
        return 'Жанр'
        break
      case 'prices':
        return 'Цена'
        break
      case 'ordering':
        return 'Сортировка'
        break
    }

    return ''
  }

  remove(item: IFilterValue) {
    const params = TAGS_LIST.getValue()

    params.map((i, key) => {
      if(item.key == i.key && item.value == i.value) {
        params.splice(key, 1)
      }
    })

    TAG_REMOVE.next(item)

    TAGS_LIST.next(params)
  }

  ngOnInit(): void {
  }

}
