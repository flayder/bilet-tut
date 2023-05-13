import { Component, Input, OnInit } from '@angular/core';
import { IDiscountItem } from 'src/app/exports/interfaces/IDiscountItem';
import { BaoService } from 'src/app/services/bao.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'tr[data-app-admin-promocode-item]',
  templateUrl: './admin-promocode-item.component.html',
  styleUrls: ['./admin-promocode-item.component.css']
})
export class AdminPromocodeItemComponent implements OnInit {

  @Input() item: IDiscountItem

  constructor(
    private bao$: BaoService,
    private message$: MessageService
  ) { }

  ngOnInit(): void {
  }

  getRole() {
    if(this.item.user.role == 'admin') {
      return 'Администратор'
    } else if(this.item.user.role == 'manager') {
      return 'Организатор'
    } else {
      return 'Пользователь'
    }
  }

  delete() {
    this.bao$.deleteDiscount(this.item.id).subscribe(response => {
      this.message$.handle('Промоакция успешно удалена', 'success')
      window.location.reload()
    })
  }

}
