import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceTableItemComponent } from './price-table-item.component';



@NgModule({
  declarations: [PriceTableItemComponent],
  imports: [
    CommonModule
  ],
  exports: [PriceTableItemComponent]
})
export class PriceTableItemModule { }
