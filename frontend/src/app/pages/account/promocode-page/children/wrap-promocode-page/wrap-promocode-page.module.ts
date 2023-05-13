import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapPromocodePageComponent } from './wrap-promocode-page.component';
import { WrapPromocodePageItemModule } from '../wrap-promocode-page-item/wrap-promocode-page-item.module';
import { RouterModule } from '@angular/router';
import { PromocodeFilterBlockModule } from '../promocode-filter-block/promocode-filter-block.module';

@NgModule({
  declarations: [WrapPromocodePageComponent],
  imports: [
    CommonModule,
    WrapPromocodePageItemModule,
    RouterModule
  ],
  exports: [WrapPromocodePageComponent]
})
export class WrapPromocodePageModule { }
