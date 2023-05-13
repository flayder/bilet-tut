import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapSpecialDetailPageComponent } from './wrap-special-detail-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [WrapSpecialDetailPageComponent],
  imports: [
    CommonModule,
    InputModule,
    SelectModule,
    ReactiveFormsModule
  ],
  exports: [WrapSpecialDetailPageComponent]
})
export class WrapSpecialDetailPageModule { }
