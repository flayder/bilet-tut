import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapReturnPageComponent } from './wrap-return-page.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { ParamsReturnPageItemModule } from '../params-return-page-item/params-return-page-item.module';



@NgModule({
  declarations: [WrapReturnPageComponent],
  imports: [
    CommonModule,
    InputModule,
    InputDateModule,
    SelectModule,
    ReactiveFormsModule,
    ParamsReturnPageItemModule
  ],
  exports: [WrapReturnPageComponent]
})
export class WrapReturnPageModule { }
