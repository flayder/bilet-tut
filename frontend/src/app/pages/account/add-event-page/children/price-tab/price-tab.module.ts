import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceTabComponent } from './price-tab.component';
import { PriceTableModule } from './children/price-table/price-table.module';
import { AreaCategoryTableModule } from './children/area-category-table/area-category-table.module';
import { SchemAreaModule } from './children/schem-area/schem-area.module';
import { DiscountTableModule } from './children/discount-table/discount-table.module';


@NgModule({
  declarations: [PriceTabComponent],
  imports: [
    CommonModule,
    PriceTableModule,
    AreaCategoryTableModule,
    SchemAreaModule,
    DiscountTableModule
  ],
  exports: [PriceTabComponent]
})
export class PriceTabModule { }
