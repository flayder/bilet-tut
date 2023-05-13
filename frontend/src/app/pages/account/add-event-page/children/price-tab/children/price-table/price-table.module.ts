import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceTableComponent } from './price-table.component';
import { PriceTableItemModule } from './children/price-table-item/price-table-item.module';



@NgModule({
  declarations: [PriceTableComponent],
  imports: [
    CommonModule,
    PriceTableItemModule
  ],
  exports: [PriceTableComponent]
})
export class PriceTableModule { }
