import { Component, OnInit } from '@angular/core';
import { INewItem } from 'src/app/exports/interfaces/INewItem';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: '[data-app-wrap-news-page]',
  templateUrl: './wrap-news-page.component.html',
  styleUrls: ['./wrap-news-page.component.css']
})
export class WrapNewsPageComponent implements OnInit {

  items: INewItem[] = []

  constructor(
    private new$: NewsService
  ) { 
    this.new$.items.subscribe(items => {
      this.items = items
    })
  }

  ngOnInit(): void {
    this.new$.getList()
  }

}
