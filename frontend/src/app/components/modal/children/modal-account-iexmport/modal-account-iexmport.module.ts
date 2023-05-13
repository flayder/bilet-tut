import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputPhoneModule } from 'src/app/components/input-phone/input-phone.module';
import { ModalAccountIexportComponent } from './modal-account-iexmport.component';


@NgModule({
  declarations: [ModalAccountIexportComponent],
  imports: [
    CommonModule,
    InputModule,
    InputPhoneModule,
    ReactiveFormsModule,
  ],
  exports: [ModalAccountIexportComponent]
})
export class ModalAccountIexportModule { }