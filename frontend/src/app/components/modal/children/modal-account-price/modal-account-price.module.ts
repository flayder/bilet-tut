import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAccountPriceComponent } from './modal-account-price.component';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorListModule } from '../color-list/color-list.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';



@NgModule({
  declarations: [ModalAccountPriceComponent],
  imports: [
    CommonModule,
    InputModule,
    InputCheckboxModule,
    SelectModule,
    InputDateModule,
    ReactiveFormsModule,
    ColorListModule
  ],
  exports: [ModalAccountPriceComponent]
})
export class ModalAccountPriceModule { }
