import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapFilterProductComponent } from './wrap-filter-product.component';
import { AccordionFilterBlockModule } from './children/accordion-filter-block/accordion-filter-block.module';
import { TagsFilterBlockModule } from './children/tags-filter-block/tags-filter-block.module';
import { StatisticEventItemModule } from './children/statistic-event-item/statistic-event-item.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { PaginationModule } from 'src/app/components/global/pagination/pagination.module';



@NgModule({
  declarations: [WrapFilterProductComponent],
  imports: [
    CommonModule,
    SelectModule,
    AccordionFilterBlockModule,
    TagsFilterBlockModule,
    StatisticEventItemModule,
    PaginationModule
  ],
  exports: [WrapFilterProductComponent]
})
export class WrapFilterProductModule { }
