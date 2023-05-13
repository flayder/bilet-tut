import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionFilterBlockComponent } from './accordion-filter-block.component';
import { AccordionItemModule } from './children/accordion-item/accordion-item.module';
import { AccordingRangeBlockModule } from './children/according-range-block/according-range-block.module';



@NgModule({
  declarations: [AccordionFilterBlockComponent],
  imports: [
    CommonModule,
    AccordionItemModule,
    AccordingRangeBlockModule
  ],
  exports: [AccordionFilterBlockComponent]
})
export class AccordionFilterBlockModule { }
