import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorListModule } from '../color-list/color-list.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';
import { ModalAccountPromocodComponent } from './modal-account-promocod.component';



@NgModule({
  declarations: [ModalAccountPromocodComponent],
  imports: [
    CommonModule,
    InputModule,
    InputCheckboxModule,
    SelectModule,
    InputDateModule,
    ReactiveFormsModule,
    ColorListModule
  ],
  exports: [ModalAccountPromocodComponent]
})
export class ModalAccountPromocodModule { }
