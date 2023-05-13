import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IBreadcrumbItem } from '../exports/interfaces/IBreadcrumbItem';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  items: BehaviorSubject<Array<IBreadcrumbItem>> = new BehaviorSubject([
    {
      path: '',
      name: 'Главная страница'
    }
  ])

  constructor() { }

  //Добавление хлебных крошек в список
  addItem(item: IBreadcrumbItem, init: boolean = false) {
    let items = this.items.getValue()

    if(init && items.length > 0) {
      items = [items[0]]
    }
    
    items.push(item)
    this.items.next(items)
  }

  //Получение хлебных крошек
  getItems() {
    return this.items
  }

}
