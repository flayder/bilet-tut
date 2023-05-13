import { Component, Input, OnInit } from '@angular/core';
import { IMailingItem } from 'src/app/exports/interfaces/IMailingItem';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'tr[data-app-mailing-item]',
  templateUrl: './mailing-item.component.html',
  styleUrls: ['./mailing-item.component.css']
})
export class MailingItemComponent implements OnInit {

  @Input() item: IMailingItem

  constructor(
    private modal$: ModalService
  ) { }

  ngOnInit(): void {
  }

  openModal() {
    this.modal$.open('account-mailing-item-tiny', this.item.user_list)
  }

}
