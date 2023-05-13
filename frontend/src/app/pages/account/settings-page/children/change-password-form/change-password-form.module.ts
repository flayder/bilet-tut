import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { InputModule } from 'src/app/components/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ChangePasswordFormComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule
  ],
  exports: [ChangePasswordFormComponent]
})
export class ChangePasswordFormModule { }
