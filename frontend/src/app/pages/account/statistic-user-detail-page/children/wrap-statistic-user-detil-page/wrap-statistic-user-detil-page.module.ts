import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapStatisticUserDetilPageComponent } from './wrap-statistic-user-detil-page.component';
import { UserMainBlockModule } from './children/user-main-block/user-main-block.module';
import { CheckoutBlockModule } from 'src/app/components/public/checkout-block/checkout-block.module';


@NgModule({
  declarations: [WrapStatisticUserDetilPageComponent],
  imports: [
    CommonModule,
    UserMainBlockModule,
    CheckoutBlockModule
  ],
  exports: [WrapStatisticUserDetilPageComponent]
})
export class WrapStatisticUserDetilPageModule { }
