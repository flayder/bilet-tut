import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailingItemComponent } from './mailing-item.component';



@NgModule({
  declarations: [MailingItemComponent],
  imports: [
    CommonModule
  ],
  exports: [MailingItemComponent]
})
export class MailingItemModule { }
