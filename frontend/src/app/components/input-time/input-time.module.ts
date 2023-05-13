import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTimeComponent } from './input-time.component';



@NgModule({
  declarations: [InputTimeComponent],
  imports: [
    CommonModule
  ],
  exports: [InputTimeComponent]
})
export class InputTimeModule { }
