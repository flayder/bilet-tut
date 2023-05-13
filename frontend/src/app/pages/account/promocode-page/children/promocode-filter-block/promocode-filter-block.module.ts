import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromocodeFilterBlockComponent } from './promocode-filter-block.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';



@NgModule({
  declarations: [PromocodeFilterBlockComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule
  ],
  exports: [PromocodeFilterBlockComponent]
})
export class PromocodeFilterBlockModule { }
