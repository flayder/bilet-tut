import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapPartnerPageItemComponent } from './wrap-partner-page-item.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [WrapPartnerPageItemComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [WrapPartnerPageItemComponent]
})
export class WrapPartnerPageItemModule { }
