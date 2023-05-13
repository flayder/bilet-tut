import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCheckerComponent } from './modal-checker.component';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputPhoneModule } from 'src/app/components/input-phone/input-phone.module';


@NgModule({
  declarations: [ModalCheckerComponent],
  imports: [
    CommonModule,
    InputModule,
    InputPhoneModule,
    ReactiveFormsModule,
  ],
  exports: [ModalCheckerComponent]
})
export class ModalCheckerModule { }
