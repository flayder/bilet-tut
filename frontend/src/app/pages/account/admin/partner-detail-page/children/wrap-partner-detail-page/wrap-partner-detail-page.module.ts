import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapPartnerDetailPageComponent } from './wrap-partner-detail-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputPhoneModule } from 'src/app/components/input-phone/input-phone.module';



@NgModule({
  declarations: [WrapPartnerDetailPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SelectModule,
    InputPhoneModule
  ],
  exports: [WrapPartnerDetailPageComponent]
})
export class WrapPartnerDetailPageModule { }
