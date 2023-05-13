import { Component, Input, OnInit } from '@angular/core';
import { IEventItem } from 'src/app/exports/interfaces/IEventItem';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'span[data-buy-btn]',
  templateUrl: './buy-btn.component.html',
  styleUrls: ['./buy-btn.component.css']
})
export class BuyBtnComponent implements OnInit {

  @Input() text: string = "Купить билет"
  @Input() setClass: string = "btn"
  @Input() data: IEventItem

  constructor(
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  clicking() {
    this.modal$.open('buy', {
      event: this.data
    })
  }

}
