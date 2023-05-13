import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountFormComponent } from './account-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from 'src/app/components/input/input.module';
import { InputPhoneModule } from 'src/app/components/input-phone/input-phone.module';
import { InputFileModule } from 'src/app/components/input-file/input-file.module';
import { ImageModule } from 'src/app/components/image/image.module';
import { InputDateModule } from 'src/app/components/input-date/input-date.module';



@NgModule({
  declarations: [AccountFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    InputPhoneModule,
    InputDateModule,
    InputFileModule,
    ImageModule
  ],
  exports: [AccountFormComponent]
})
export class AccountFormModule { }
