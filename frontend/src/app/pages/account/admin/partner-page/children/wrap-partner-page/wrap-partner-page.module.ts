import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapPartnerPageComponent } from './wrap-partner-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WrapPartnerPageItemModule } from '../wrap-partner-page-item/wrap-partner-page-item.module';



@NgModule({
  declarations: [WrapPartnerPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WrapPartnerPageItemModule
  ],
  exports: [WrapPartnerPageComponent]
})
export class WrapPartnerPageModule { }
