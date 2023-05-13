import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapAddPromotionPageComponent } from './wrap-add-promotion-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputModule } from 'src/app/components/input/input.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';



@NgModule({
  declarations: [WrapAddPromotionPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    InputModule,
    InputDateModule
  ],
  exports: [WrapAddPromotionPageComponent]
})
export class WrapAddPromotionPageModule { }
