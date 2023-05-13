import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapWithdrawalPageComponent } from './wrap-withdrawal-page.component';
import { WithdrawalPageItemModule } from './children/withdrawal-page-item/withdrawal-page-item.module';



@NgModule({
  declarations: [WrapWithdrawalPageComponent],
  imports: [
    CommonModule,
    WithdrawalPageItemModule
  ],
  exports: [WrapWithdrawalPageComponent]
})
export class WrapWithdrawalPageModule { }
