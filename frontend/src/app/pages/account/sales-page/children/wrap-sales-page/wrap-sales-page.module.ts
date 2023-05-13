import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapSalesPageComponent } from './wrap-sales-page.component';
import { WrapSalesPageItemModule } from '../wrap-sales-page-item/wrap-sales-page-item.module';



@NgModule({
  declarations: [WrapSalesPageComponent],
  imports: [
    CommonModule,
    WrapSalesPageItemModule
  ],
  exports: [WrapSalesPageComponent]
})
export class WrapSalesPageModule { }
