import { Component, Input, OnInit } from '@angular/core';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { IHttpResponse } from 'src/app/exports/interfaces/IHttpResponse';
import { EventService } from 'src/app/services/event.service';
import { MessageService } from 'src/app/services/message.service';

type favoriteText = 'adding' | 'removing' | null

@Component({
  selector: 'div[data-app-favorite]',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  @Input() setClass: string = ""
  @Input() item: IEventItem

  constructor(
    private event$: EventService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {
  }

  toggleFavorite() {
    this.event$.toggleFavorite(this.item.id).subscribe((response: IHttpResponse) => {
      if(response.results.stateText == 'adding') {
        this.item.favorite = true
        this.message$.handle(this.item.name + ' был успешно добавлен в избранное', 'success')
      } else {
        this.item.favorite = false
        this.message$.handle(this.item.name + ' был успешно удален из избранного', 'success')
      }
    })
  }

}
