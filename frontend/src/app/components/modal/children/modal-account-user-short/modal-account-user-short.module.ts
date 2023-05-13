import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalAccountUserShortComponent } from './modal-account-user-short.component';
import { InputPhoneModule } from 'src/app/components/input-phone/input-phone.module';



@NgModule({
  declarations: [ModalAccountUserShortComponent],
  imports: [
    CommonModule,
    InputModule,
    InputPhoneModule,
    ReactiveFormsModule,
  ],
  exports: [ModalAccountUserShortComponent]
})
export class ModalAccountUserShortModule { }
