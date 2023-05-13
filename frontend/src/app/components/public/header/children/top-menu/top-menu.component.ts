import { Component, OnInit } from '@angular/core';
import { ITopMenu } from 'src/app/exports/interfaces/ITopMenu';

@Component({
  selector: 'span[data-app-top-menu]',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {
  usualMenu: Array<ITopMenu> = [
    {
      href: "/concert",
      name: "Концерты"
    },
    {
      href: "/perfomance",
      name: "Спектакли"
    },
    {
      href: "/exhibition",
      name: "Выставки"
    },
    {
      href: "/show",
      name: "Шоу"
    },
    {
      href: "/children",
      name: "Детям"
    }
  ]
  constructor() { }

  currentMenu() {
    return this.usualMenu
  }

  ngOnInit(): void {
  }

}
