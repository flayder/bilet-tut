import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WithdrawalPageItemComponent } from './withdrawal-page-item.component';



@NgModule({
  declarations: [WithdrawalPageItemComponent],
  imports: [
    CommonModule
  ],
  exports: [WithdrawalPageItemComponent]
})
export class WithdrawalPageItemModule { }
