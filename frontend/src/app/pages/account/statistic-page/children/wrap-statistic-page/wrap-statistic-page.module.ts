import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapStatisticPageComponent } from './wrap-statistic-page.component';
import { WrapFilterProductModule } from '../wrap-filter-product/wrap-filter-product.module';
import { WrapStatisticUserModule } from '../wrap-statistic-user/wrap-statistic-user.module';
import { WrapStatisticCheckinModule } from '../wrap-statistic-checkin/wrap-statistic-checkin.module';



@NgModule({
  declarations: [WrapStatisticPageComponent],
  imports: [
    CommonModule,
    WrapFilterProductModule,
    WrapStatisticUserModule,
    WrapStatisticCheckinModule
  ],
  exports: [WrapStatisticPageComponent]
})
export class WrapStatisticPageModule { }
