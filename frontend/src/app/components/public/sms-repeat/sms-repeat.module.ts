import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsRepeatComponent } from './sms-repeat.component';



@NgModule({
  declarations: [SmsRepeatComponent],
  imports: [
    CommonModule
  ],
  exports: [SmsRepeatComponent]
})
export class SmsRepeatModule { }
