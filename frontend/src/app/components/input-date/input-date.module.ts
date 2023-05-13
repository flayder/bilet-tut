import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDateComponent } from './input-date.component';



@NgModule({
  declarations: [InputDateComponent],
  imports: [
    CommonModule
  ],
  exports: [InputDateComponent]
})
export class InputDateModule { }
