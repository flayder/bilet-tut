import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountTableComponent } from './discount-table.component';
import { DiscountTableItemModule } from './children/discount-table-item/discount-table-item.module';


@NgModule({
  declarations: [DiscountTableComponent],
  imports: [
    CommonModule,
    DiscountTableItemModule
  ],
  exports: [DiscountTableComponent]
})
export class DiscountTableModule { }
