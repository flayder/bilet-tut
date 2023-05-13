import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapAddPromocodePageComponent } from './wrap-add-promocode-page.component';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';



@NgModule({
  declarations: [WrapAddPromocodePageComponent],
  imports: [
    CommonModule,
    SelectModule,
    InputModule,
    InputDateModule,
    InputCheckboxModule,
    ReactiveFormsModule
  ],
  exports: [WrapAddPromocodePageComponent]
})
export class WrapAddPromocodePageModule { }
