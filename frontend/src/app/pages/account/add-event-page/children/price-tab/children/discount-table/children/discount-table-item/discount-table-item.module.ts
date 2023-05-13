import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTableItemComponent } from './discount-table-item.component';



@NgModule({
  declarations: [DiscountTableItemComponent],
  imports: [
    CommonModule
  ],
  exports: [DiscountTableItemComponent]
})
export class DiscountTableItemModule { }
