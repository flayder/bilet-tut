import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/components/input/input.module';
import { SelectModule } from 'src/app/components/select/select.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorListModule } from '../color-list/color-list.module';
import { InputCheckboxModule } from 'src/app/components/input-checkbox/input-checkbox.module';
import { ModalAccountCategoryComponent } from './modal-account-category.component';
import { LoaderModule } from 'src/app/components/global/loader/loader.module';



@NgModule({
  declarations: [ModalAccountCategoryComponent],
  imports: [
    CommonModule,
    InputModule,
    InputCheckboxModule,
    SelectModule,
    InputDateModule,
    ReactiveFormsModule,
    ColorListModule
  ],
  exports: [ModalAccountCategoryComponent]
})
export class ModalAccountCategoryModule { }
